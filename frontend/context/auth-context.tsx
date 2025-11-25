"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { apiClient, type User } from "@/lib/api-client"

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (payload: { email: string; password: string }) => Promise<void>
  register: (payload: { name: string; email: string; password: string; dateOfBirth?: string }) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("df_token") : null
    if (!token) {
      setLoading(false)
      return
    }
    apiClient
      .me()
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("df_token")
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleAuthSuccess = (authResponse: { user: User; token: string }) => {
    localStorage.setItem("df_token", authResponse.token)
    setUser(authResponse.user)
  }

  const login = async (payload: { email: string; password: string }) => {
    const data = await apiClient.login(payload)
    handleAuthSuccess(data)
    router.replace("/dashboard")
  }

  const register = async (payload: { name: string; email: string; password: string; dateOfBirth?: string }) => {
    const data = await apiClient.register(payload)
    handleAuthSuccess(data)
    router.replace("/dashboard")
  }

  const logout = async () => {
    try {
      await apiClient.logout()
    } catch (error) {
      // ignore logout error
    }
    localStorage.removeItem("df_token")
    setUser(null)
    router.replace("/login")
  }

  const refresh = async () => {
    const data = await apiClient.me()
    setUser(data.user)
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return ctx
}


