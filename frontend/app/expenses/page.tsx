"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ExpenseList } from "@/components/expense-list"

export default function ExpensesPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Riwayat Pengeluaran</h1>
          <p className="text-muted-foreground">Kelola dan pantau semua pengeluaran Anda</p>
        </div>
        <ExpenseList />
      </div>
    </DashboardLayout>
  )
}
