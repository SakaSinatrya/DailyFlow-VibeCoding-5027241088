"use client"

import React, { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts"

const COLORS = ["#7d5ba6", "#ff9800", "#4caf50", "#2196f3", "#f44336", "#6c63ff", "#009688"]

export function YAxisTick(props: any) {
  const { x, y, payload } = props
  const value = payload?.value ?? 0
  const formatted = Number(value).toLocaleString("id-ID", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  })
  // Render the currency prefix and the formatted number as a single text node
  // to avoid SVG wrapping which could place the prefix above/below the number.
  const text = `Rp ${formatted}`
  return (
    <g transform={`translate(${x}, ${y})`}>
      <text x={-8} y={0} textAnchor="end" dominantBaseline="central" className="text-xs fill-muted-foreground">
        {text}
      </text>
    </g>
  )
}

export default function ExpensesCharts({ weeklyData, filteredCategoryData }: { weeklyData: any[]; filteredCategoryData: any[] }) {
  const [isSmall, setIsSmall] = useState(false)

  useEffect(() => {
    const check = () => setIsSmall(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line chart: weekly */}
        <div className="border-0 shadow-lg">
          <div className="p-4">
            <div className="mb-2">
              <h3 className="text-base font-medium">Pengeluaran Mingguan</h3>
              <p className="text-sm text-muted-foreground">Tren pengeluaran 7 hari terakhir</p>
            </div>
            <div className="overflow-x-auto pb-4">
              <div style={{ minWidth: Math.max(weeklyData.length * 100, 640) + 160, height: 300, paddingLeft: 48 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData} margin={{ top: 20, right: 24, left: 80, bottom: isSmall ? 36 : 12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="label" tickMargin={8} {...(isSmall ? { angle: -45, textAnchor: 'end', interval: 0 } : {})} />
                    <YAxis tick={YAxisTick} tickMargin={8} width={90} />
                    <Tooltip formatter={(value: number | string) => `Rp ${Number(value).toLocaleString("id-ID")}`} />
                    <Line type="monotone" dataKey="amount" stroke="#7d5ba6" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Pie chart: category distribution */}
        <div className="border-0 shadow-lg">
          <div className="p-4">
            <div className="mb-2">
              <h3 className="text-base font-medium">Distribusi Kategori</h3>
              <p className="text-sm text-muted-foreground">Persentase pengeluaran per kategori</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] items-start">
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={filteredCategoryData} cx="50%" cy="50%" labelLine={false} outerRadius={90} dataKey="value">
                      {filteredCategoryData.map((entry, index) => (
                        <Cell key={`cell-${entry.key}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number | string) => `Rp ${Number(value).toLocaleString("id-ID")}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                {filteredCategoryData.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Belum ada data per kategori.</p>
                ) : (
                  filteredCategoryData.map((item, index) => {
                    const total = filteredCategoryData.reduce((s, it) => s + it.value, 0)
                    const percent = total ? Math.round((item.value / total) * 100) : 0
                    return (
                      <div key={item.key} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{percent}% dari total</p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold">Rp {item.value.toLocaleString("id-ID")}</p>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bar chart: category totals */}
        <div className="col-span-1 lg:col-span-2 border-0 shadow-lg">
          <div className="p-4">
            <div className="mb-2">
              <h3 className="text-base font-medium">Pengeluaran Per Kategori</h3>
              <p className="text-sm text-muted-foreground">Total pengeluaran berdasarkan kategori</p>
            </div>
            <div className="flex justify-center">
              {/* keep bar chart visually consistent: fixed max width on large screens, full width on small screens */}
              <div style={{ width: isSmall ? '100%' : 800, height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredCategoryData} margin={{ top: 20, right: 24, left: 10, bottom: isSmall ? 36 : 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" tickMargin={10} {...(isSmall ? { angle: -45, textAnchor: 'end', interval: 0 } : {})} />
                    <YAxis tick={YAxisTick} width={100} />
                    <Tooltip formatter={(value: number | string) => `Rp ${Number(value).toLocaleString("id-ID")}`} />
                    <Bar
                      dataKey="value"
                      fill="#7d5ba6"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={48}
                      barSize={Math.min(64, Math.max(12, Math.floor(600 / Math.max(1, filteredCategoryData.length))))}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
