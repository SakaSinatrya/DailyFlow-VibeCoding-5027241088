"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { User } from "lucide-react"
import { DatePickerModal } from "@/components/date-picker-modal"
import { Spinner } from "@/components/ui/spinner"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { apiClient, type User as ProfileUser } from "@/lib/api-client"
import { useAuth } from "@/context/auth-context"

type ProfileState = Pick<ProfileUser, "name" | "email" | "dateOfBirth" | "avatarUrl">

const calculateAge = (dateOfBirth?: string | null) => {
  if (!dateOfBirth) return 0
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1
  }
  return age
}

export function ProfileForm() {
  const [profile, setProfile] = useState<ProfileState | null>(null)
  const [formData, setFormData] = useState<ProfileState | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()
  const { refresh } = useAuth()

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        setLoading(true)
        const { user } = await apiClient.profile.get()
        if (!active) return
        setProfile(user)
        setFormData(user)
      } catch (error) {
        if (!active) return
        toast({
          title: "Gagal memuat profil",
          description: (error as Error).message,
          variant: "destructive",
        })
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [toast])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev))
  }

  const handleDateChange = (date: string) => {
    setFormData((prev) => (prev ? { ...prev, dateOfBirth: date } : prev))
  }

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { file: uploaded } = await apiClient.upload(file)
      setFormData((prev) => (prev ? { ...prev, avatarUrl: uploaded.url } : prev))
      toast({
        title: "Foto berhasil diunggah",
        description: "Avatar baru siap disimpan.",
      })
    } catch (error) {
      toast({
        title: "Gagal mengunggah foto",
        description: (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!formData) return
    setSaving(true)
    try {
      const payload: Record<string, unknown> = {
        name: formData.name,
        email: formData.email,
        avatarUrl: formData.avatarUrl,
      }
      if (formData.dateOfBirth) {
        payload.dateOfBirth = formData.dateOfBirth
      }

      const { user } = await apiClient.profile.update(payload)
      setProfile(user)
      setFormData(user)
      setIsEditing(false)
      await refresh()
      toast({
        title: "Profil tersimpan",
        description: "Perubahan profil berhasil diperbarui.",
      })
    } catch (error) {
      toast({
        title: "Gagal menyimpan profil",
        description: (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(profile)
    setIsEditing(false)
  }

  if (loading) {
    return (
      <Card className="p-10 flex items-center justify-center">
        <Spinner className="w-6 h-6 text-primary" />
      </Card>
    )
  }

  if (!formData) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Profil tidak tersedia.</p>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="p-6 md:p-8">
        <div className="flex flex-col items-center mb-8 pb-8 border-b border-border">
          <div className="relative mb-4">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-primary shadow-lg">
              <Image
                src={formData.avatarUrl || "/placeholder.svg"}
                alt="Avatar"
                width={128}
                height={128}
                sizes="(max-width: 640px) 96px, 128px"
                className="object-cover w-full h-full"
              />
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors shadow-md">
                <User className="w-4 h-4" />
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {isEditing ? "Klik ikon untuk mengubah foto" : "Foto Profil"}
          </p>
        </div>

          <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-semibold text-foreground">
              Nama Lengkap
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-foreground">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
              placeholder="Masukkan email Anda"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">Tanggal Lahir</label>
            <DatePickerModal
              value={formData.dateOfBirth || ""}
              onChange={handleDateChange}
              disabled={!isEditing}
              placeholder="Pilih tanggal lahir Anda"
            />
          </div>

          <div className="bg-muted rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground">💡 Tekan tombol "Edit Profil" untuk mengubah informasi Anda</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                Edit Profil
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  disabled={saving || uploading}
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex-1 bg-transparent" disabled={saving}>
                  Batal
                </Button>
              </>
            )}
          </div>
        </div>

        {profile && (
          <div className="mt-8 pt-8 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">Informasi Profil Saat Ini</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Nama</p>
                <p className="font-semibold text-foreground">{profile.name}</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="font-semibold text-foreground text-sm break-all">{profile.email}</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Tanggal Lahir & Umur</p>
                <p className="font-semibold text-foreground">
                  {profile.dateOfBirth
                    ? new Date(profile.dateOfBirth).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "-"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{calculateAge(profile.dateOfBirth)} tahun</p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
