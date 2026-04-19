"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export type HomeEvent = {
  id: string
  title: string
  start: Date
  end: Date
  calendarId: string
  color?: string | null
}

const DAYS = ["S", "M", "T", "W", "T", "F", "S"]

interface MiniCalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  events?: HomeEvent[]
}

export function MiniCalendar({
  selectedDate,
  onDateSelect,
  events = [],
}: MiniCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date(selectedDate))
  const today = new Date()

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  const eventDaySet = useMemo(() => {
    const set = new Set<number>()
    for (const e of events) {
      if (e.start.getFullYear() === year && e.start.getMonth() === month) {
        set.add(e.start.getDate())
      }
    }
    return set
  }, [events, year, month])

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  const handleDayClick = (day: number | null) => {
    if (!day) return
    onDateSelect(new Date(year, month, day))
  }

  return (
    <div className="glass rounded-2xl p-4 shadow-lg flex flex-col h-full">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-foreground">
          {viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 rounded-xl hover:bg-white/50"
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 rounded-xl hover:bg-white/50"
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((d, i) => (
          <div key={i} className="text-xs text-center font-semibold text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1 flex-1">
        {days.map((day, i) => {
          const date = day ? new Date(year, month, day) : null
          const selected = date && isSameDay(date, selectedDate)
          const todayMatch = date && isSameDay(date, today)
          const hasEvent = day && eventDaySet.has(day)

          return (
            <button
              key={i}
              disabled={!day}
              onClick={() => handleDayClick(day)}
              className={[
                "relative flex flex-col items-center justify-center rounded-xl text-xs font-medium transition-all py-1.5",
                selected
                  ? "bg-primary text-primary-foreground shadow-md scale-110"
                  : todayMatch
                  ? "ring-2 ring-primary/60 bg-white/40 text-foreground"
                  : day
                  ? "hover:bg-white/50 text-foreground"
                  : "opacity-0 pointer-events-none",
              ].join(" ")}
            >
              {day}
              {hasEvent && !selected && (
                <span
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "var(--primary)" }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
