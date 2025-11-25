"use client"

import { useEffect, useState, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"
const ExpensesCharts = dynamic(() => import("@/components/expenses/charts"), { ssr: false, loading: () => <div className="p-12 flex items-center justify-center"> <Spinner className="w-6 h-6 text-primary" /> </div> })
import { apiClient, type ExpenseSummary } from "@/lib/api-client"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"

const COLORS = ["#7d5ba6", "#ff9800", "#4caf50", "#2196f3", "#f44336", "#6c63ff", "#009688"]

const categoryLabels: Record<string, string> = {
  food: "Makanan",
  transport: "Transportasi",
  bills: "Tagihan",
  entertainment: "Hiburan",
  health: "Kesehatan",
  other: "Lainnya",
}

export default function ExpenseSummaryPage() {
  const [summary, setSummary] = useState<ExpenseSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    let active = true
    const loadSummary = async () => {
      try {
        setLoading(true)
        const data = await apiClient.expenses.summary()
        if (!active) return
        setSummary(data)
      } catch (err) {
        const message = (err as Error).message
        if (!active) return
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

    loadSummary()
    return () => {
      active = false
    }
  }, [toast])

  const weeklyData =
    summary?.weeklyTrend.map((item) => ({
      label: item.label,
      amount: item.amount,
    })) ?? []

  const categoryData =
    summary?.byCategory.map((item) => ({
      key: item.category,
      name: categoryLabels[item.category] ?? item.category,
      value: item.amount,
    })) ?? []

  const [categoryRange, setCategoryRange] = useState<'today' | '7days' | 'month' | 'year' | 'all'>('all')
  const [filteredCategoryData, setFilteredCategoryData] = useState<typeof categoryData>(categoryData)

  const categoryTotal = categoryData.reduce((sum, item) => sum + item.value, 0)

  const formatCompactCurrency = (value: number | string) =>
    `Rp ${Number(value).toLocaleString("id-ID", {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1,
    })}`

  // Custom Y axis tick that places the currency prefix to the left of the value
  function YAxisTick(props: any) {
    const { x, y, payload } = props
    const value = payload?.value ?? 0
    const formatted = Number(value).toLocaleString("id-ID", {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1,
    })
    // Use non-breaking space between number and suffix to avoid unwanted wrapping
    const parts = formatted.split(' ')
    const main = parts.slice(0, parts.length - 1).join(' ') || formatted
    const suffix = parts.length > 1 ? `\u00A0${parts[parts.length - 1]}` : ''

    return (
      <g transform={`translate(${x}, ${y})`}>
        <text x={-8} y={0} textAnchor="end" dominantBaseline="central" className="text-xs fill-muted-foreground">
          <tspan className="font-medium">Rp</tspan>
          <tspan dx={6}>{main}</tspan>
          {suffix ? <tspan>{suffix}</tspan> : null}
        </text>
      </g>
    )
  }

  // compute dynamic minWidth for weekly chart so points don't get cut off
    // compute dynamic minWidth for weekly chart so points don't get cut off
    // add extra horizontal padding so Y-axis labels on the left are not clipped
    const weeklyMinWidth = Math.max(weeklyData.length * 100, 640)
    const weeklyExtraPadding = 160
    const weeklyInitialLeftSpace = 48
    const weeklyScrollRef = useRef<HTMLDivElement | null>(null)

    // center the chart on mount (but keep it scrollable). Use a timeout/rAF so measurements are ready.
    useEffect(() => {
      const el = weeklyScrollRef.current
      if (!el) return
      const tryCenter = () => {
        try {
          const scrollableWidth = el.scrollWidth - el.clientWidth
          if (scrollableWidth > 0) {
            el.scrollLeft = Math.round(scrollableWidth / 2)
          }
        } catch (e) {
          // ignore
        }
      }

      // schedule center after paint
      const id = window.requestAnimationFrame(() => setTimeout(tryCenter, 0))
      return () => window.cancelAnimationFrame(id)
    }, [weeklyData.length])

  // load filtered category data when range changes
  useEffect(() => {
    let active = true

    const loadFiltered = async () => {
      try {
        if (categoryRange === 'all') {
          setFilteredCategoryData(categoryData)
          return
        }

        const now = new Date()
        let start: Date | null = null
        let end: Date | null = null

        if (categoryRange === 'today') {
          start = new Date(now)
          start.setHours(0, 0, 0, 0)
          end = new Date(start)
        } else if (categoryRange === '7days') {
          end = new Date(now)
          start = new Date(now)
          start.setDate(start.getDate() - 6)
          start.setHours(0, 0, 0, 0)
        } else if (categoryRange === 'month') {
          start = new Date(now.getFullYear(), now.getMonth(), 1)
          end = new Date(now)
        } else if (categoryRange === 'year') {
          start = new Date(now.getFullYear(), 0, 1)
          end = new Date(now)
        }

        const params: Record<string, string> = {}
        if (start) params.startDate = start.toISOString()
        if (end) params.endDate = end.toISOString()

        const res = await apiClient.expenses.list({ ...params, limit: '1000' })
        if (!active) return
        const expenses = res.expenses
        const map: Record<string, number> = {}
        for (const e of expenses) {
          map[e.category] = (map[e.category] || 0) + (e.amount || 0)
        }

        const arr = Object.entries(map).map(([key, value]) => ({
          key,
          name: categoryLabels[key] ?? key,
          value,
        }))

        setFilteredCategoryData(arr)
      } catch (err) {
        // fail silently for filter changes; keep previous data
      }
    }

    loadFiltered()

    return () => {
      active = false
    }
  }, [categoryRange, summary])

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Ringkasan Pengeluaran</h1>
          <p className="text-muted-foreground">Analisis real-time dari pengeluaran Anda</p>
        </div>

        {loading ? (
          <Card className="p-12 flex items-center justify-center">
            <Spinner className="w-6 h-6 text-primary" />
          </Card>
        ) : summary ? (
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Ringkasan Grafis</h2>
                  <p className="text-sm text-muted-foreground">Visualisasi pengeluaran</p>
                </div>
                <div>
                  <Select value={categoryRange} onValueChange={(value) => setCategoryRange(value as any)}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Rentang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Hari ini</SelectItem>
                      <SelectItem value="7days">7 Hari</SelectItem>
                      <SelectItem value="month">Bulan</SelectItem>
                      <SelectItem value="year">Tahun</SelectItem>
                      <SelectItem value="all">Semua</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <ExpensesCharts weeklyData={weeklyData} filteredCategoryData={filteredCategoryData} />
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">{error ?? "Ringkasan belum tersedia."}</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
