"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ExpenseSummaryCard } from "@/components/expense-summary-card"
import { TaskSummaryCard } from "@/components/task-summary-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Plus, Clock } from "lucide-react"
import { apiClient, type ExpenseSummary, type TaskSummary } from "@/lib/api-client"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"

const categoryLabels: Record<string, string> = {
  food: "Makanan",
  transport: "Transportasi",
  bills: "Tagihan",
  entertainment: "Hiburan",
  health: "Kesehatan",
  other: "Lainnya",
}

const formatCurrency = (value: number) => `Rp ${value.toLocaleString("id-ID")}`

export default function DashboardPage() {
  const [overview, setOverview] = useState<{ expenses: ExpenseSummary; tasks: TaskSummary } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    let active = true
    const loadOverview = async () => {
      try {
        setLoading(true)
        const data = await apiClient.overview()
        if (!active) return
        setOverview(data)
      } catch (err) {
        if (!active) return
        const message = (err as Error).message
        setError(message)
        toast({
          title: "Gagal memuat ringkasan",
          description: message,
          variant: "destructive",
        })
      } finally {
        if (active) setLoading(false)
      }
    }

    loadOverview()
    return () => {
      active = false
    }
  }, [toast])

  const expenseCardData = useMemo(() => {
    if (!overview) return null
    return {
      today: overview.expenses.totals.today,
      week: overview.expenses.totals.week,
      topCategory: {
        name: categoryLabels[overview.expenses.topCategory.name] ?? overview.expenses.topCategory.name,
        amount: overview.expenses.topCategory.amount,
      },
    }
  }, [overview])

  const taskCardData = useMemo(() => {
    if (!overview) return null
    const hasTodayData = overview.tasks.today.total > 0 || overview.tasks.today.completed > 0
    const source = hasTodayData ? overview.tasks.today : overview.tasks.weekly
    return {
      total: source.total,
      completed: source.completed,
    }
  }, [overview])

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Selamat datang kembali!</h1>
          <p className="text-muted-foreground">Pantau ringkasan keuangan dan aktivitas harian Anda</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Link href="/expenses/add">
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4" />
              Tambah Pengeluaran
            </Button>
          </Link>
          <Link href="/tasks/add">
            <Button variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Tambah Tugas
            </Button>
          </Link>
        </div>

        {loading ? (
          <Card className="p-12 flex items-center justify-center">
            <Spinner className="w-6 h-6 text-primary" />
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {expenseCardData && <ExpenseSummaryCard {...expenseCardData} />}
              {taskCardData && <TaskSummaryCard {...taskCardData} />}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Pengeluaran Terbaru</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {overview?.expenses.recentExpenses.length ? "5 transaksi terakhir" : "Belum ada transaksi"}
                    </p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {overview?.expenses.recentExpenses.length ? (
                    overview.expenses.recentExpenses.map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {categoryLabels[expense.category] ?? expense.category}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(expense.date).toLocaleDateString("id-ID")}
                          </p>
                        </div>
                        <p className="font-semibold text-primary">{formatCurrency(expense.amount)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Belum ada data pengeluaran.</p>
                  )}
                  <Link href="/expenses" className="text-sm text-primary hover:underline">
                    Lihat semua pengeluaran
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Tugas Mendatang</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {overview?.tasks.upcoming.length ? "Fokus pada tenggat terdekat" : "Tidak ada tugas menunggu"}
                    </p>
                  </div>
                  <Clock className="w-5 h-5 text-primary" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {overview?.tasks.upcoming.length ? (
                    overview.tasks.upcoming.map((task) => (
                      <div key={task.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{task.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(task.deadline).toLocaleDateString("id-ID")}
                          </p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {task.category}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Tidak ada tugas yang belum selesai.</p>
                  )}
                  <Link href="/tasks/today" className="text-sm text-primary hover:underline">
                    Kelola tugas
                  </Link>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
