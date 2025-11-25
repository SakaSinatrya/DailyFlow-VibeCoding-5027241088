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
  { id: "food", label: "Makanan", color: "bg-orange-100 text-orange-700" },
  { id: "transport", label: "Transportasi", color: "bg-blue-100 text-blue-700" },
  { id: "bills", label: "Tagihan", color: "bg-red-100 text-red-700" },
  { id: "entertainment", label: "Hiburan", color: "bg-purple-100 text-purple-700" },
  { id: "health", label: "Kesehatan", color: "bg-green-100 text-green-700" },
  { id: "other", label: "Lainnya", color: "bg-gray-100 text-gray-700" },
]

export function ExpenseForm() {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("food")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState("")
  const [attachmentName, setAttachmentName] = useState<string | null>(null)
  const [attachmentUrl, setAttachmentUrl] = useState<string | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const resetForm = () => {
    setAmount("")
    setCategory("food")
    setDate(new Date().toISOString().split("T")[0])
    setNotes("")
    setAttachmentName(null)
    setAttachmentUrl(undefined)
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const { file: uploaded } = await apiClient.upload(file)
      setAttachmentUrl(uploaded.url)
      setAttachmentName(file.name)
      toast({
        title: "Lampiran berhasil diunggah",
        description: "File siap dikirim bersama pengeluaran.",
      })
    } catch (error) {
      toast({
        title: "Gagal mengunggah file",
        description: (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await apiClient.expenses.create({
        amount: Number(amount),
        category,
        date,
        notes: notes || undefined,
        attachmentUrl,
      })

      toast({
        title: "Pengeluaran tersimpan",
        description: "Data pengeluaran berhasil dicatat.",
      })
      resetForm()
      router.push("/expenses")
    } catch (error) {
      toast({
        title: "Gagal menyimpan pengeluaran",
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
        <CardTitle>Tambah Pengeluaran Baru</CardTitle>
        <CardDescription>Catat setiap pengeluaran Anda dengan rincian lengkap</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nominal (Rp)</label>
              <Input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg"
                min="0"
                step="1000"
                required
              />
            </div>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tanggal</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Lampiran (Opsional)</label>
              <Input type="file" accept="image/*,.pdf" onChange={handleFileChange} disabled={uploading} />
              {attachmentName && (
                <p className="text-xs text-muted-foreground mt-2">
                  File: <span className="font-medium text-foreground">{attachmentName}</span>
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Catatan (Opsional)</label>
            <Textarea
              placeholder="Tambahkan catatan untuk pengeluaran ini..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
              rows={4}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base py-6"
            disabled={isSubmitting || uploading}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Pengeluaran"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
