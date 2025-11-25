"use client"

import { useCallback, useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2, Flag, RefreshCw } from "lucide-react"
import { apiClient, type Task } from "@/lib/api-client"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"

const priorityMap: Record<string, { label: string; bgColor: string }> = {
  high: { label: "Tinggi", bgColor: "bg-red-50 text-red-600" },
  medium: { label: "Sedang", bgColor: "bg-yellow-50 text-yellow-600" },
  low: { label: "Rendah", bgColor: "bg-green-50 text-green-600" },
}

const categoryMap: Record<string, string> = {
  kuliah: "Kuliah",
  kerja: "Kerja",
  lifestyle: "Lifestyle",
  personal: "Personal",
  other: "Lainnya",
}

export function TodayTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const LIMIT = 20
  const [meta, setMeta] = useState<{ total: number; page: number; limit: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const loadTasks = useCallback(async (silent = false) => {
    setError(null)
    if (silent) setRefreshing(true)
    else setLoading(true)
    try {
      const data = await apiClient.tasks.list({ range: "today", page: String(1), limit: String(LIMIT) })
      setTasks(data.tasks)
      setPage(1)
      setMeta(data.meta ?? null)
    } catch (err) {
      const message = (err as Error).message
      setError(message)
      toast({ title: "Gagal memuat tugas", description: message, variant: "destructive" })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [toast])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const loadMore = async () => {
    if (meta && page * meta.limit >= meta.total) return
    const next = page + 1
    try {
      const data = await apiClient.tasks.list({ range: "today", page: String(next), limit: String(LIMIT) })
      // append unique items
      setTasks((prev) => {
        const ids = new Set(prev.map((t) => t.id))
        const incoming = data.tasks.filter((t) => !ids.has(t.id))
        return [...prev, ...incoming]
      })
      setPage(next)
      setMeta(data.meta ?? null)
    } catch (err) {
      toast({ title: "Gagal memuat halaman berikutnya", description: (err as Error).message, variant: "destructive" })
    }
  }

  const completed = tasks.filter((task) => task.completed).length
  const percentage = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100)

  const handleToggle = async (task: Task) => {
    try {
      const { task: updated } = await apiClient.tasks.update(task.id, { completed: !task.completed })
      setTasks((prev) => prev.map((item) => (item.id === task.id ? updated : item)))
    } catch (err) {
      toast({
        title: "Gagal memperbarui tugas",
        description: (err as Error).message,
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Hapus tugas ini?")
    if (!confirmed) return
    try {
      await apiClient.tasks.remove(id)
      setTasks((prev) => prev.filter((task) => task.id !== id))
      toast({
        title: "Tugas dihapus",
        description: "Tugas telah dihapus dari daftar hari ini.",
      })
    } catch (err) {
      toast({
        title: "Gagal menghapus tugas",
        description: (err as Error).message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <p className="text-muted-foreground text-sm">Progress Hari Ini</p>
              <p className="text-3xl font-bold">
                {completed}/{tasks.length}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" className="gap-2" onClick={() => loadTasks(true)} disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                Segarkan
              </Button>
              <div className="text-right">
                <p className="text-4xl font-bold text-accent">{percentage}%</p>
                <p className="text-xs text-muted-foreground">Tugas selesai</p>
              </div>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-primary transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
          {error && <p className="text-sm text-destructive mt-4">{error}</p>}
        </CardContent>
      </Card>

      {loading ? (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="py-12 flex flex-col items-center gap-3">
            <Spinner className="w-6 h-6 text-primary" />
            <p className="text-muted-foreground text-sm">Memuat tugas hari ini...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Tidak ada tugas hari ini. Nikmati waktu luangmu!</p>
              </CardContent>
            </Card>
          ) : (
            tasks.map((task) => (
              <Card
                key={task.id}
                className={`transition-all ${task.completed ? "opacity-60 bg-muted/30" : "hover:shadow-md"}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Checkbox checked={task.completed} onCheckedChange={() => handleToggle(task)} className="mt-1" />
                    <div className="flex-1">
                      <div className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.name}
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                          {categoryMap[task.category] ?? task.category}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${priorityMap[task.priority]?.bgColor ?? "bg-gray-100 text-gray-600"}`}>
                          <Flag className="w-3 h-3" />
                          {priorityMap[task.priority]?.label ?? task.priority}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(task.deadline).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      {task.notes && <p className="text-sm text-muted-foreground mt-2">{task.notes}</p>}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive/80"
                      onClick={() => handleDelete(task.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
      {/* Load more control */}
      {meta && meta.total > tasks.length && (
        <div className="flex justify-center mt-2">
          <Button onClick={loadMore} disabled={loading || refreshing} size="sm">
            {loading || refreshing ? 'Memuat...' : 'Muat lebih'}
          </Button>
        </div>
      )}
    </div>
  )
}
