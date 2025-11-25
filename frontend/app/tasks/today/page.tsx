"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { TodayTasks } from "@/components/today-tasks"

export default function TodayTasksPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tugas Hari Ini</h1>
          <p className="text-muted-foreground">Pantau dan selesaikan tugas Anda hari ini</p>
        </div>
        <TodayTasks />
      </div>
    </DashboardLayout>
  )
}
