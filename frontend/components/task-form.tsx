"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"

const categories = [
  { id: "kuliah", label: "Kuliah" },
  { id: "kerja", label: "Kerja" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "personal", label: "Personal" },
  { id: "other", label: "Lainnya" },
]

const priorities = [
  { id: "low", label: "Rendah", color: "text-green-600" },
  { id: "medium", label: "Sedang", color: "text-yellow-600" },
  { id: "high", label: "Tinggi", color: "text-red-600" },
]

export function TaskForm() {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("personal")
  const [deadline, setDeadline] = useState(new Date().toISOString().split("T")[0])
  const [deadlineTime, setDeadlineTime] = useState(new Date().toTimeString().slice(0,5))
  const [priority, setPriority] = useState("medium")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const resetForm = () => {
    setName("")
    setCategory("personal")
    setDeadline(new Date().toISOString().split("T")[0])
    setPriority("medium")
    setNotes("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // combine date + time into ISO string
      const isoDeadline = `${deadline}T${deadlineTime}:00`
      await apiClient.tasks.create({
        name,
        category,
        deadline: isoDeadline,
        priority,
        notes: notes || undefined,
      })
      toast({
        title: "Tugas berhasil dibuat",
        description: "Tugas baru siap dikerjakan.",
      })
      resetForm()
      router.push("/tasks/today")
    } catch (error) {
      toast({
        title: "Gagal menyimpan tugas",
        description: (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Tambah Tugas Baru</CardTitle>
        <CardDescription>Buat tugas baru dan atur prioritasnya</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nama Tugas</label>
            <Input
              type="text"
              placeholder="Contoh: Membaca buku, Belajar JavaScript..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-base"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Kategori</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Deadline</label>
              <div className="flex gap-2">
                <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
                <Input type="time" value={deadlineTime} onChange={(e) => setDeadlineTime(e.target.value)} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Prioritas</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih prioritas" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((pri) => (
                    <SelectItem key={pri.id} value={pri.id}>
                      {pri.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Deskripsi (Opsional)</label>
            <Textarea
              placeholder="Tambahkan detail tugas Anda..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
              rows={4}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Menyimpan..." : "Buat Tugas"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
