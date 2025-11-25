"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ExpenseForm } from "@/components/expense-form"

const quickTips = [
  {
    title: "Tips Hemat",
    description: "Catat pengeluaran maksimal 24 jam setelah transaksi agar laporan tetap akurat.",
  },
  {
    title: "Kategori Favorit",
    description: "Gunakan kategori yang konsisten supaya grafik distribusi lebih mudah dibaca.",
  },
]

export default function AddExpensePage() {
  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tambah Pengeluaran</h1>
          <p className="text-muted-foreground">Catat pengeluaran Anda untuk melacak keuangan dengan lebih baik</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2.5fr)_minmax(260px,1fr)] items-start">
          <ExpenseForm />
          <div className="space-y-4">
            {quickTips.map((tip) => (
              <div key={tip.title} className="p-5 rounded-xl border bg-card shadow-sm">
                <h3 className="text-base font-semibold mb-1">{tip.title}</h3>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </div>
            ))}
            <div className="p-5 rounded-xl border bg-gradient-to-br from-primary/10 to-accent/10 shadow-sm">
              <p className="text-sm text-muted-foreground">Total pengeluaran pekan ini</p>
              <p className="text-3xl font-bold text-primary mt-2">Rp 0</p>
              <p className="text-xs text-muted-foreground mt-1">
                Angka akan ter-update otomatis setelah transaksi tersimpan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
