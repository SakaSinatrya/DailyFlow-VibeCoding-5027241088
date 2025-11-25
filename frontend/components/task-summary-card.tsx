"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

interface TaskSummaryProps {
  total: number
  completed: number
}

export function TaskSummaryCard({ total, completed }: TaskSummaryProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-accent" />
          Tugas Hari Ini
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <CardDescription>Progress</CardDescription>
            <span className="text-sm md:text-base font-semibold">{percentage}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-primary transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <CardDescription>Total Tugas</CardDescription>
            <div className="text-xl md:text-2xl font-bold">{total}</div>
          </div>
          <div className="space-y-1">
            <CardDescription>Selesai</CardDescription>
            <div className="text-xl md:text-2xl font-bold text-accent">{completed}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
