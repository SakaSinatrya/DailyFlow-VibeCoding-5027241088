"use client"

import { useState } from "react"
import { LogOut } from "lucide-react"
import { Button } from "./ui/button"
import { useAuth } from "@/context/auth-context"

export function LogoutDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const { logout } = useAuth()

  const handleLogout = async () => {
    setIsOpen(false)
    await logout()
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-2">Konfirmasi Logout</h2>
            <p className="text-foreground/70 mb-6">Apakah Anda yakin ingin keluar dari akun ini?</p>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
