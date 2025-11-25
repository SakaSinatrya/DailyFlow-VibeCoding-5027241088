"use client"

import React from "react"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  React.useEffect(() => {
    document.documentElement.classList.remove("dark")
    localStorage.setItem("theme", "light")
  }, [])

  return <div className="min-h-screen bg-background">{children}</div>
}
