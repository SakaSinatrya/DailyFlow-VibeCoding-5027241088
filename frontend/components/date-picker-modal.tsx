"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { CalendarIcon, X, ChevronDown } from "lucide-react"

interface DatePickerModalProps {
  value?: string
  onChange: (date: string) => void
  disabled?: boolean
  placeholder?: string
}

export function DatePickerModal({
  value,
  onChange,
  disabled = false,
  placeholder = "Pilih tanggal lahir",
}: DatePickerModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [month, setMonth] = useState(new Date(value || new Date()))
  const [showYearSelector, setShowYearSelector] = useState(false)
  const [showMonthSelector, setShowMonthSelector] = useState(false)
  const [selectedYear, setSelectedYear] = useState(new Date(value || new Date()).getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date(value || new Date()).getMonth())
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentYear = new Date().getFullYear()
  const yearRange = Array.from({ length: 100 }, (_, i) => currentYear - 100 + i).reverse()
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowYearSelector(false)
        setShowMonthSelector(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleDateSelect = (date: Date) => {
    onChange(date.toISOString().split("T")[0])
    setIsOpen(false)
    setShowYearSelector(false)
    setShowMonthSelector(false)
  }

  const handleYearSelect = (year: number) => {
    setSelectedYear(year)
    const newDate = new Date(month)
    newDate.setFullYear(year)
    setMonth(newDate)
    setShowYearSelector(false)
  }

  const handleMonthSelect = (monthIndex: number) => {
    setSelectedMonth(monthIndex)
    const newDate = new Date(month)
    newDate.setMonth(monthIndex)
    setMonth(newDate)
    setShowMonthSelector(false)
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
    <div className="relative w-full" ref={dropdownRef}>
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
        <div className="absolute top-full left-0 mt-2 bg-background border border-border rounded-lg shadow-xl z-50 p-4 w-full sm:w-auto">
          <div className="mb-4 pb-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Pilih Tanggal Lahir</h3>
            <p className="text-xs text-muted-foreground mt-1">Tanggal tidak boleh melebihi hari ini</p>
          </div>

          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Button
                variant="outline"
                className="w-full justify-between bg-transparent"
                onClick={() => {
                  setShowYearSelector(!showYearSelector)
                  setShowMonthSelector(false)
                }}
              >
                <span className="text-sm">{selectedYear}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>

              {showYearSelector && (
                <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 w-full max-h-48 overflow-y-auto">
                  {yearRange.map((year) => (
                    <button
                      key={year}
                      onClick={() => handleYearSelect(year)}
                      className={`w-full px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground transition-colors ${
                        selectedYear === year ? "bg-primary text-primary-foreground font-semibold" : ""
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative flex-1">
              <Button
                variant="outline"
                className="w-full justify-between bg-transparent"
                onClick={() => {
                  setShowMonthSelector(!showMonthSelector)
                  setShowYearSelector(false)
                }}
              >
                <span className="text-sm">{months[selectedMonth]}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>

              {showMonthSelector && (
                <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 w-full max-h-48 overflow-y-auto">
                  {months.map((month, index) => (
                    <button
                      key={month}
                      onClick={() => handleMonthSelect(index)}
                      className={`w-full px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground transition-colors ${
                        selectedMonth === index ? "bg-primary text-primary-foreground font-semibold" : ""
                      }`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

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
