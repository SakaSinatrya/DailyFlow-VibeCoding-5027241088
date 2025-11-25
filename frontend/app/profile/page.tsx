"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProfileForm } from "@/components/profile-form"

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold">Profil Saya</h1>
          <p className="text-muted-foreground">Kelola informasi profil dan pengaturan akun Anda</p>
        </div>
        <ProfileForm />
      </div>
    </DashboardLayout>
  )
}
