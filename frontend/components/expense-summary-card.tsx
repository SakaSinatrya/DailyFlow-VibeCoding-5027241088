"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet } from "lucide-react"

interface ExpenseSummaryProps {
  today: number
  week: number
  topCategory: { name: string; amount: number }
}

export function ExpenseSummaryCard({ today, week, topCategory }: ExpenseSummaryProps) {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          Ringkasan Pengeluaran
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <CardDescription>Hari Ini</CardDescription>
            <div className="text-xl md:text-2xl font-bold text-primary">Rp {today.toLocaleString("id-ID")}</div>
          </div>
          <div className="space-y-1">
            <CardDescription>Minggu Ini</CardDescription>
            <div className="text-xl md:text-2xl font-bold text-accent">Rp {week.toLocaleString("id-ID")}</div>
          </div>
          <div className="space-y-1">
            <CardDescription>Kategori Terbanyak</CardDescription>
            <div className="text-sm font-semibold text-foreground">{topCategory.name}</div>
            <div className="text-base md:text-lg font-bold text-primary">Rp {topCategory.amount.toLocaleString("id-ID")}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
