"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { apiClient, type TaskSummary } from "@/lib/api-client"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export function WeeklyTasks() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  // helper: start of week (Monday)
  const startOfWeek = (d: Date) => {
    const dd = new Date(d)
    const day = (dd.getDay() + 6) % 7 // make Monday=0
    dd.setDate(dd.getDate() - day)
    dd.setHours(0, 0, 0, 0)
    return dd
  }

  // selected week start (Date)
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(() => startOfWeek(new Date()))

  // fetch tasks for the selected week
  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const start = new Date(selectedWeekStart)
        const end = new Date(start)
        end.setDate(end.getDate() + 6)

        const res = await apiClient.tasks.list({ startDate: start.toISOString(), endDate: end.toISOString(), limit: '1000' })
        if (!active) return
        setTasks(res.tasks)
      } catch (err) {
        const message = (err as Error).message
        setError(message)
        toast({ title: "Gagal memuat tugas", description: message, variant: "destructive" })
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [selectedWeekStart, toast])

  // group tasks by day in the selected week
  const weekDays = useMemo(() => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(selectedWeekStart)
      d.setDate(d.getDate() + i)
      days.push(d)
    }
    return days
  }, [selectedWeekStart])

  const tasksByDay = useMemo(() => {
    const map: Record<string, any[]> = {}
    for (const day of weekDays) {
      map[day.toDateString()] = []
    }
    for (const t of tasks) {
      const d = new Date(t.deadline).toDateString()
      if (!map[d]) map[d] = []
      map[d].push(t)
    }
    return map
  }, [tasks, weekDays])

  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.completed).length
    const completionRate = total ? Math.round((completed / total) * 100) : 0
    return { total, completed, completionRate }
  }, [tasks])

  const [updatingIds, setUpdatingIds] = useState<string[]>([])
  

  // Edit dialog state
  const [editTask, setEditTask] = useState<any | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  // edit form fields
  const [editName, setEditName] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editTime, setEditTime] = useState('')
  const [editNotes, setEditNotes] = useState('')

  useEffect(() => {
    if (!editTask) return
    setEditName(editTask.name || '')
    if (editTask.deadline) {
      const d = new Date(editTask.deadline)
      setEditDate(d.toISOString().slice(0, 10))
      setEditTime(d.toTimeString().slice(0, 5))
    } else {
      setEditDate('')
      setEditTime('')
    }
    setEditNotes(editTask.notes || '')
  }, [editTask])

  const openEdit = (task: any) => {
    setEditTask(task)
    setEditOpen(true)
  }

  const handleDelete = async (task: any) => {
    // open confirmation dialog instead of immediate deletion
    if (!task?.id) return
    setDeleteTask(task)
    setDeleteOpen(true)
  }

  // delete confirmation state
  const [deleteTask, setDeleteTask] = useState<any | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const confirmDelete = async () => {
    if (!deleteTask?.id) return
    setDeleteOpen(false)
    try {
      await apiClient.tasks.remove(deleteTask.id)
      setTasks((prev) => prev.filter((t) => t.id !== deleteTask.id))
      toast({ title: 'Tugas dihapus' })
    } catch (err) {
      const message = (err as Error).message
      toast({ title: 'Gagal menghapus tugas', description: message, variant: 'destructive' })
    } finally {
      setDeleteTask(null)
    }
  }

  const handleEditSave = async (updates: any) => {
    if (!editTask?.id) return
    setUpdatingIds((s) => [...s, editTask.id])
    try {
      await apiClient.tasks.update(editTask.id, updates)
      setTasks((prev) => prev.map((t) => (t.id === editTask.id ? { ...t, ...updates } : t)))
      setEditOpen(false)
      setEditTask(null)
      toast({ title: 'Tugas diperbarui' })
    } catch (err) {
      const message = (err as Error).message
      toast({ title: 'Gagal memperbarui tugas', description: message, variant: 'destructive' })
    } finally {
      setUpdatingIds((s) => s.filter((id) => id !== editTask.id))
    }
  }

  const goPrevWeek = () => {
    const d = new Date(selectedWeekStart)
    d.setDate(d.getDate() - 7)
    setSelectedWeekStart(startOfWeek(d))
  }

  const goNextWeek = () => {
    const d = new Date(selectedWeekStart)
    d.setDate(d.getDate() + 7)
    setSelectedWeekStart(startOfWeek(d))
  }

  const onPickDate: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const v = e.target.value
    if (!v) return
    const d = new Date(v + "T00:00:00")
    setSelectedWeekStart(startOfWeek(d))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button onClick={goPrevWeek} className="btn">◀</button>
          <div className="px-3 py-1 rounded-md bg-muted/30">
            <div className="text-sm font-medium">Minggu dari</div>
            <div className="text-xs text-muted-foreground">{selectedWeekStart.toLocaleDateString()}</div>
          </div>
          <button onClick={goNextWeek} className="btn">▶</button>
        </div>

        <div className="flex items-center gap-2">
          <input type="date" onChange={onPickDate} className="input" />
        </div>
      </div>

      {loading ? (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="py-12 flex flex-col items-center gap-3">
            <Spinner className="w-6 h-6 text-primary" />
            <p className="text-muted-foreground text-sm">Memuat tugas minggu...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {weekDays.map((day) => {
              const key = day.toDateString()
              const list = tasksByDay[key] || []
              const completed = list.filter((t) => t.completed).length
              return (
                <div key={key}>
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setSelectedDay(day)
                        setDialogOpen(true)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedDay(day)
                          setDialogOpen(true)
                        }
                      }}
                      className="p-4 text-center space-y-3 cursor-pointer"
                    >
                      <div>
                        <p className="font-bold text-lg">{day.toLocaleDateString(undefined, { weekday: 'short' })}</p>
                        <p className="text-xs text-muted-foreground">{day.toLocaleDateString()}</p>
                      </div>
                      {list.length > 0 ? (
                        <>
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                            <span className="font-bold text-sm text-primary">{completed}/{list.length}</span>
                          </div>
                          <Badge variant="outline" className={completed === list.length ? 'bg-green-50 text-green-700' : completed > 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-50 text-gray-600'}>
                            {completed === list.length ? 'Selesai' : completed > 0 ? 'Sebagian' : 'Pending'}
                          </Badge>
                        </>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                            <span className="text-xs text-muted-foreground">—</span>
                          </div>
                          <Badge variant="outline" className="bg-gray-50 text-gray-600">Kosong</Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>

          <Card className="bg-secondary/20 border-0">
            <CardHeader>
              <CardTitle className="text-base">Statistik Mingguan</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Tugas</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Selesai</p>
                <p className="text-2xl font-bold text-accent">{stats.completed}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tingkat Penyelesaian</p>
                <p className="text-2xl font-bold">{stats.completionRate}%</p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
      {/* Day tasks dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
        <DialogContent className="sm:max-w-4xl max-w-[90%]">
          <DialogHeader>
            <DialogTitle>{selectedDay ? `Tugas — ${selectedDay.toLocaleDateString()}` : 'Tugas'}</DialogTitle>
            <DialogDescription className="mb-2">Daftar tugas untuk hari yang dipilih</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto py-2">
            {selectedDay ? (
              (tasksByDay[selectedDay.toDateString()] || []).length ? (
                (tasksByDay[selectedDay.toDateString()] || []).map((t) => (
                  <div key={t.id} className="border rounded-md p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{new Date(t.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        {t.notes && <p className="text-sm mt-1 text-muted-foreground">{t.notes}</p>}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={t.completed ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'}>
                          {t.completed ? 'Selesai' : 'Pending'}
                        </Badge>
                        <div className="flex flex-col items-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEdit(t)}>
                            <Edit2 className="mr-2" />
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(t)}>
                            <Trash2 className="mr-2" />
                            Hapus
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Tidak ada tugas pada hari ini.</p>
              )
            ) : (
              <p className="text-sm text-muted-foreground">Pilih hari untuk melihat tugasnya.</p>
            )}
          </div>
          <DialogFooter>
            <DialogClose className="inline-flex items-center justify-center rounded-md bg-muted/20 px-3 py-2 text-sm">Tutup</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={(open) => { if (!open) { setDeleteOpen(false); setDeleteTask(null) } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Tugas?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTask ? `Apakah Anda yakin ingin menghapus tugas "${deleteTask.name}"? Tindakan ini tidak dapat dibatalkan.` : 'Hapus tugas yang dipilih.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setDeleteOpen(false); setDeleteTask(null) }}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit task dialog */}
      <Dialog open={editOpen} onOpenChange={(open) => { if (!open) { setEditOpen(false); setEditTask(null) } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tugas</DialogTitle>
            <DialogDescription className="mb-2">Ubah detail tugas dan simpan perubahan</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Nama</label>
              <input autoFocus className="input w-full" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm mb-1">Tanggal</label>
                <input type="date" className="input w-full" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm mb-1">Waktu</label>
                <input type="time" className="input w-full" value={editTime} onChange={(e) => setEditTime(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Catatan</label>
              <textarea className="input w-full" rows={3} value={editNotes} onChange={(e) => setEditNotes(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditOpen(false); setEditTask(null) }}>Batal</Button>
            <Button
              onClick={async () => {
                if (!editTask) return
                const iso = editDate ? `${editDate}T${editTime || '00:00'}:00` : undefined
                const updates: any = { name: editName, notes: editNotes }
                if (iso) updates.deadline = iso
                await handleEditSave(updates)
              }}
            >Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
