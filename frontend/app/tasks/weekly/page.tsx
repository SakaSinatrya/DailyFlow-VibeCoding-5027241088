"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { WeeklyTasks } from "@/components/weekly-tasks"

export default function WeeklyTasksPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tugas Mingguan</h1>
          <p className="text-muted-foreground">Lihat performa tugas Anda selama minggu ini</p>
        </div>
        <WeeklyTasks />
      </div>
    </DashboardLayout>
  )
}
