"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Wallet, CheckSquare, User } from "lucide-react"
import { LogoutDialog } from "./logout-dialog"
import { ThemeToggle } from "./theme-toggle"

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Expense Tracker",
    href: "#",
    icon: Wallet,
    children: [
      { label: "Tambah Pengeluaran", href: "/expenses/add" },
      { label: "Lihat Pengeluaran", href: "/expenses" },
      { label: "Ringkasan", href: "/expenses/summary" },
    ],
  },
  {
    label: "To-Do List",
    href: "#",
    icon: CheckSquare,
    children: [
      { label: "Tambah Tugas", href: "/tasks/add" },
      { label: "Tugas Hari Ini", href: "/tasks/today" },
      { label: "Lihat Mingguan", href: "/tasks/weekly" },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]))
  }

  return (
    <div className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen sticky top-0 overflow-y-auto flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold text-lg">DF</span>
          </div>
          <span className="text-lg font-bold">DailyFlow</span>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <div key={item.label}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleExpand(item.label)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedItems.includes(item.label) ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>

                {expandedItems.includes(item.label) && item.children && (
                  <div className="ml-3 mt-2 space-y-1 border-l border-sidebar-border pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                          pathname === child.href
                            ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold"
                            : "text-sidebar-foreground hover:bg-sidebar-accent"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* User Menu */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Link href="/profile">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
            <User className="w-5 h-5" />
            <span>Profil</span>
          </button>
        </Link>
        <ThemeToggle />
        <LogoutDialog />
      </div>
    </div>
  )
}
