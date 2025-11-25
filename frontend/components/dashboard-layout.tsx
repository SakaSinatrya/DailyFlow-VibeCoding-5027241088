"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from '@/components/ui/drawer'
import { Menu } from 'lucide-react'
import { useAuth } from "@/context/auth-context"
import { Spinner } from "@/components/ui/spinner"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [loading, user, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-12 h-12" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile drawer trigger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Drawer>
          <DrawerTrigger asChild>
            <button aria-label="Open menu" className="p-2 rounded-md bg-muted/50">
              <Menu className="w-6 h-6" />
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="p-4">
              <DrawerClose asChild>
                <button className="mb-4">Close</button>
              </DrawerClose>
              <Sidebar />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="w-full max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
