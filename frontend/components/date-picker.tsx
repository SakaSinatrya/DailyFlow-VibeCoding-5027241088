"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { CalendarIcon, X } from "lucide-react"

interface DatePickerProps {
  value?: string
  onChange: (date: string) => void
  disabled?: boolean
  placeholder?: string
}

export function DatePicker({
  value,
  onChange,
  disabled = false,
  placeholder = "Pilih tanggal lahir",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [month, setMonth] = useState(new Date(value || new Date()))
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleDateSelect = (date: Date) => {
    onChange(date.toISOString().split("T")[0])
    setIsOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange("")
    setIsOpen(false)
  }

  const displayDate = value
    ? new Date(value).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : placeholder

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        variant="outline"
        className="w-full justify-between text-left font-normal disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>{displayDate}</span>
        <div className="flex items-center gap-2">
          {value && !disabled && <X className="h-4 w-4 cursor-pointer" onClick={handleClear} />}
          <CalendarIcon className="h-4 w-4" />
        </div>
      </Button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 p-4">
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={(date) => {
              if (date) handleDateSelect(date)
            }}
            month={month}
            onMonthChange={setMonth}
            disabled={(date) => date > new Date()}
          />
        </div>
      )}
    </div>
  )
}
