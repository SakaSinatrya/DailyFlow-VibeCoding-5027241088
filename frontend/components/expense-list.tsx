"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, RefreshCw } from "lucide-react"
import { apiClient, type Expense } from "@/lib/api-client"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"

const categoryMap: Record<string, string> = {
  food: "Makanan",
  transport: "Transportasi",
  bills: "Tagihan",
  entertainment: "Hiburan",
  health: "Kesehatan",
  other: "Lainnya",
}

export function ExpenseList() {
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterDate, setFilterDate] = useState("")
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const LIMIT = 20
  const [meta, setMeta] = useState<{ total: number; page: number; limit: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchExpenses = useCallback(
    async (silent = false) => {
      setError(null)
      if (silent) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      try {
        const params: Record<string, string> = {}
        if (filterCategory !== "all") {
          params.category = filterCategory
        }
        if (filterDate) {
          params.date = filterDate
        }
        // request first page
        params.page = String(1)
        params.limit = String(LIMIT)
        const data = await apiClient.expenses.list(params)
        setExpenses(data.expenses)
        setPage(1)
        setMeta(data.meta ?? null)
      } catch (err) {
        const message = (err as Error).message
        setError(message)
        toast({
          title: "Gagal memuat pengeluaran",
          description: message,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [filterCategory, filterDate, toast],
  )

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  const loadMore = async () => {
    if (meta && page * meta.limit >= meta.total) return
    const next = page + 1
    try {
      const params: Record<string, string> = {}
      if (filterCategory !== "all") params.category = filterCategory
      if (filterDate) params.date = filterDate
      params.page = String(next)
      params.limit = String(LIMIT)
      const data = await apiClient.expenses.list(params)
      setExpenses((prev) => {
        const ids = new Set(prev.map((e) => e.id))
        const incoming = data.expenses.filter((e) => !ids.has(e.id))
        return [...prev, ...incoming]
      })
      setPage(next)
      setMeta(data.meta ?? null)
    } catch (err) {
      toast({ title: 'Gagal memuat halaman berikutnya', description: (err as Error).message, variant: 'destructive' })
    }
  }

  const totalAmount = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses],
  )

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Hapus pengeluaran ini?")
    if (!confirmed) return
    try {
      await apiClient.expenses.remove(id)
      setExpenses((prev) => prev.filter((expense) => expense.id !== id))
      toast({
        title: "Pengeluaran dihapus",
        description: "Data berhasil dihapus.",
      })
    } catch (err) {
      toast({
        title: "Gagal menghapus pengeluaran",
        description: (err as Error).message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-secondary/30 border-0">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Filter Kategori</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {Object.entries(categoryMap).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Filter Tanggal</label>
              <Input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilterCategory("all")
                  setFilterDate("")
                }}
                className="w-full"
              >
                Reset Filter
              </Button>
            </div>
            <div className="flex items-end">
              <Button
                variant="secondary"
                className="w-full gap-2"
                onClick={() => fetchExpenses(true)}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                Muat Ulang
              </Button>
            </div>
          </div>
          {error && <p className="text-sm text-destructive mt-4">{error}</p>}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-muted-foreground text-sm mb-1">Total Pengeluaran</p>
            <p className="text-3xl font-bold text-primary">Rp {totalAmount.toLocaleString("id-ID")}</p>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="py-12 flex flex-col items-center gap-3">
            <Spinner className="w-6 h-6 text-primary" />
            <p className="text-muted-foreground text-sm">Memuat pengeluaran...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {expenses.length === 0 ? (
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Tidak ada pengeluaran yang cocok</p>
              </CardContent>
            </Card>
          ) : (
            expenses.map((expense) => (
              <Card key={expense.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                          {categoryMap[expense.category] ?? expense.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(expense.date).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      {expense.notes && <p className="text-sm text-muted-foreground">{expense.notes}</p>}
                      {expense.attachmentUrl && (
                        <a
                          href={expense.attachmentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          Lihat lampiran
                        </a>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">Rp {expense.amount.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive/80"
                        onClick={() => handleDelete(expense.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
      {meta && meta.total > expenses.length && (
        <div className="flex justify-center mt-2">
          <Button onClick={loadMore} disabled={loading || refreshing} size="sm">
            {loading || refreshing ? 'Memuat...' : 'Muat lebih'}
          </Button>
        </div>
      )}
    </div>
  )
}
