"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { TaskForm } from "@/components/task-form"

const focusNotes = [
  {
    title: "Prioritas Tinggi",
    description: "Gunakan prioritas 'tinggi' untuk tugas dengan deadline < 24 jam.",
  },
  {
    title: "Blok Waktu",
    description: "Tambahkan catatan durasi agar mudah memblok waktu di kalender.",
  },
]

export default function AddTaskPage() {
  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tambah Tugas</h1>
          <p className="text-muted-foreground">Buat tugas baru untuk hari Anda</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2.5fr)_minmax(260px,1fr)] items-start">
          <TaskForm />
          <div className="space-y-4">
            {focusNotes.map((item) => (
              <div key={item.title} className="p-5 rounded-xl border bg-card shadow-sm">
                <h3 className="text-base font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
            <div className="p-5 rounded-xl border bg-gradient-to-br from-accent/10 to-primary/10 shadow-sm">
              <p className="text-sm text-muted-foreground">Progress hari ini</p>
              <p className="text-3xl font-bold text-accent mt-2">0%</p>
              <p className="text-xs text-muted-foreground mt-1">
                Progress akan meningkat otomatis saat tugas ditandai selesai.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
