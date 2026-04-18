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
  events?: HomeEvent[] // ✅ optional
}

export function MiniCalendar({
  selectedDate,
  onDateSelect,
  events = [], // ✅ DEFAULT
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
      if (
        e.start.getFullYear() === year &&
        e.start.getMonth() === month
      ) {
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
    <div className="bg-card border border-border rounded-2xl p-4 w-[200px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">
          {viewDate.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6"
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
          >
            <ChevronLeft className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6"
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
          >
            <ChevronRight className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((d) => (
          <div key={d} className="text-xs text-center text-muted-foreground">
            {d}
          </div>
        ))}

        {days.map((day, i) => {
          const date = day ? new Date(year, month, day) : null
          const selected = date && isSameDay(date, selectedDate)
          const todayMatch = date && isSameDay(date, today)

          return (
            <button
              key={i}
              disabled={!day}
              onClick={() => handleDayClick(day)}
              className={`relative py-1.5 rounded-md text-xs ${
                selected
                  ? "bg-foreground text-background"
                  : todayMatch
                    ? "ring-1 ring-foreground"
                    : "hover:bg-secondary"
              }`}
            >
              {day}
              {day && eventDaySet.has(day) && !selected && (
                <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-foreground/50 rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
