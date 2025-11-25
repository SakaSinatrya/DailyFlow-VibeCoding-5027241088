export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
const API_BASE_ORIGIN = API_BASE_URL.replace(/\/api$/, "")

export interface User {
  id: string
  name: string
  email: string
  dateOfBirth?: string
  avatarUrl?: string
}

export interface Expense {
  id: string
  amount: number
  category: string
  date: string
  notes?: string
  attachmentUrl?: string
}

export interface Task {
  id: string
  name: string
  category: string
  priority: string
  deadline: string
  completed: boolean
  notes?: string
}

export interface ExpenseSummary {
  totals: { today: number; week: number; month: number }
  topCategory: { name: string; amount: number }
  byCategory: { category: string; amount: number }[]
  weeklyTrend: { date: string; label: string; amount: number }[]
  recentExpenses: Expense[]
}

export interface TaskSummary {
  today: {
    total: number
    completed: number
    tasks: Task[]
  }
  weekly: {
    total: number
    completed: number
    completionRate: number
    breakdown: { day: string; date: string; total: number; completed: number; status: string; statusColor: string }[]
  }
  upcoming: Task[]
}

const toAbsoluteUrl = (value?: string | null) => {
  if (!value) return undefined
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value
  }
  return `${API_BASE_ORIGIN}${value}`
}

const mapExpense = (expense: any): Expense => ({
  id: expense.id ?? expense._id ?? "",
  amount: expense.amount,
  category: expense.category,
  date: typeof expense.date === "string" ? expense.date : new Date(expense.date).toISOString(),
  notes: expense.notes,
  attachmentUrl: toAbsoluteUrl(expense.attachmentUrl),
})

const mapTask = (task: any): Task => ({
  id: task.id ?? task._id ?? "",
  name: task.name,
  category: task.category,
  priority: task.priority,
  deadline: typeof task.deadline === "string" ? task.deadline : new Date(task.deadline).toISOString(),
  completed: Boolean(task.completed),
  notes: task.notes,
})

const mapUser = (user: User): User => ({
  ...user,
  avatarUrl: toAbsoluteUrl(user.avatarUrl),
})

const mapExpenseSummary = (summary: ExpenseSummary): ExpenseSummary => ({
  ...summary,
  recentExpenses: summary.recentExpenses?.map(mapExpense) ?? [],
})

const mapTaskSummary = (summary: TaskSummary): TaskSummary => ({
  today: {
    ...summary.today,
    tasks: summary.today.tasks?.map(mapTask) ?? [],
  },
  weekly: summary.weekly,
  upcoming: summary.upcoming?.map(mapTask) ?? [],
})

const getToken = () => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("df_token")
}

type RequestOptions = RequestInit & { auth?: boolean }

class ApiError extends Error {
  status: number | null
  code: string | null
  info: any
  constructor(message: string, status: number | null = null, code: string | null = null, info: any = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.info = info
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers || {})
  const isFormData = options.body instanceof FormData
  if (!isFormData && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')

  if (options.auth !== false) {
    const token = getToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const url = `${API_BASE_URL}${path}`

  // retry/backoff for transient network errors or 5xx responses
  const maxAttempts = 3
  let attempt = 0
  let lastErr: any = null

  while (attempt < maxAttempts) {
    attempt += 1
    try {
      const response = await fetch(url, { ...options, headers })

      let data: unknown = {}
      try {
        data = await response.json()
      } catch (e) {
        data = {}
      }

      if (!response.ok) {
        const message = (data as { message?: string })?.message || 'Terjadi kesalahan pada server'
        const status = response.status
        // retry on 502/503/504
        if ([502, 503, 504].includes(status) && attempt < maxAttempts) {
          lastErr = new ApiError(message, status, null, data)
          await new Promise((r) => setTimeout(r, 200 * Math.pow(2, attempt)))
          continue
        }
        throw new ApiError(message, status, null, data)
      }

      return data as T
    } catch (err) {
      // fetch/network error
      lastErr = err
      // if transient, retry
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, 200 * Math.pow(2, attempt)))
        continue
      }
      if (err instanceof ApiError) throw err
      throw new ApiError((err as Error).message || 'Network error', null, 'NETWORK_ERROR', null)
    }
  }

  throw lastErr instanceof Error ? lastErr : new ApiError('Unknown error')
}

export const apiClient = {
  register: async (payload: { name: string; email: string; password: string; dateOfBirth?: string }) => {
    const data = await request<{ user: User; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: false,
    })
    return { user: mapUser(data.user), token: data.token }
  },
  login: async (payload: { email: string; password: string }) => {
    const data = await request<{ user: User; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: false,
    })
    return { user: mapUser(data.user), token: data.token }
  },
  me: async () => {
    const data = await request<{ user: User }>("/auth/me")
    return { user: mapUser(data.user) }
  },
  logout: () => request<{ message: string }>("/auth/logout", { method: "POST" }),
  expenses: {
    list: async (params: Record<string, string | number | undefined> = {}) => {
      const search = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          search.append(key, String(value))
        }
      })
      const query = search.toString()
      const data = await request<{ expenses: Expense[]; meta?: { total: number; page: number; limit: number } }>(`/expenses${query ? `?${query}` : ""}`)
      return { expenses: data.expenses.map(mapExpense), meta: data.meta ?? null }
    },
    create: async (payload: { amount: number; category: string; date: string; notes?: string; attachmentUrl?: string }) => {
      const data = await request<{ expense: Expense }>("/expenses", {
        method: "POST",
        body: JSON.stringify(payload),
      })
      return { expense: mapExpense(data.expense) }
    },
    update: async (id: string, payload: Record<string, unknown>) => {
      const data = await request<{ expense: Expense }>(`/expenses/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      })
      return { expense: mapExpense(data.expense) }
    },
    remove: (id: string) =>
      request<{ message: string }>(`/expenses/${id}`, {
        method: "DELETE",
      }),
    summary: async () => {
      const summary = await request<ExpenseSummary>("/expenses/summary")
      return mapExpenseSummary(summary)
    },
  },
  tasks: {
    list: async (params: Record<string, string | undefined> = {}) => {
      const search = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value) search.append(key, value)
      })
      const query = search.toString()
      const data = await request<{ tasks: Task[]; meta?: { total: number; page: number; limit: number } }>(`/tasks${query ? `?${query}` : ""}`)
      return { tasks: data.tasks.map(mapTask), meta: data.meta ?? null }
    },
    create: async (payload: { name: string; category: string; deadline: string; priority: string; notes?: string }) => {
      const data = await request<{ task: Task }>("/tasks", {
        method: "POST",
        body: JSON.stringify(payload),
      })
      return { task: mapTask(data.task) }
    },
    update: async (id: string, payload: Record<string, unknown>) => {
      const data = await request<{ task: Task }>(`/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      })
      return { task: mapTask(data.task) }
    },
    remove: (id: string) =>
      request<{ message: string }>(`/tasks/${id}`, {
        method: "DELETE",
      }),
    summary: async () => {
      const summary = await request<TaskSummary>("/tasks/summary")
      return mapTaskSummary(summary)
    },
  },
  overview: async () => {
    const data = await request<{ expenses: ExpenseSummary; tasks: TaskSummary }>("/overview")
    return {
      expenses: mapExpenseSummary(data.expenses),
      tasks: mapTaskSummary(data.tasks),
    }
  },
  profile: {
    get: async () => {
      const data = await request<{ user: User }>("/profile")
      return { user: mapUser(data.user) }
    },
    update: async (payload: Record<string, unknown>) => {
      const data = await request<{ user: User }>("/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      })
      return { user: mapUser(data.user) }
    },
  },
  upload: async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    const data = await request<{ file: { url: string } }>("/upload", {
      method: "POST",
      body: formData,
    })
    const url = toAbsoluteUrl(data.file.url)
    return { file: { ...data.file, url } }
  },
}


