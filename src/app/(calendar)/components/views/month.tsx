"use client"

import React, { useState } from "react"
import type { CalendarEvent, Calendar, HubMember } from "../../types"

interface MonthViewProps {
  currentDate: Date
  events: CalendarEvent[]
  calendars: Calendar[] // kept for parity
  members: HubMember[]
  onDateSelect: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
  onCreateEvent: (date: Date) => void
  onMoveEvent: (eventId: string, newDate: Date) => void
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

/* =========================
 * ✅ TIMEZONE-SAFE DAY MATCH
 * ========================= */
function isSameLocalDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function MonthView({
  currentDate,
  events,
  members,
  onDateSelect,
  onEventClick,
  onCreateEvent,
  onMoveEvent,
}: MonthViewProps) {
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null)
  const [_dragOverDate, setDragOverDate] = useState<Date | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const startingDay = firstDayOfMonth.getDay()
  const totalDays = lastDayOfMonth.getDate()

  const days: (Date | null)[] = []

  for (let i = 0; i < startingDay; i++) days.push(null)
  for (let i = 1; i <= totalDays; i++) days.push(new Date(year, month, i))

  /* =========================
   * EVENTS PER DAY (FIXED)
   * ========================= */
  const getEventsForDate = (date: Date) => {
    return events.filter((event) =>
      isSameLocalDay(new Date(event.date), date)
    )
  }

  /* =========================
   * NULL-SAFE MEMBER COLOR
   * ========================= */
  const getMemberColor = (creatorId: string | null) => {
    if (!creatorId) return "#ffffff"
    return members.find((m) => m.id === creatorId)?.color || "#ffffff"
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return isSameLocalDay(date, today)
  }

  /* =========================
   * DRAG HANDLERS
   * ========================= */
  const handleDragStart = (e: React.DragEvent, event: CalendarEvent) => {
    setDraggedEvent(event)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", event.id)
  }

  const handleDragOver = (e: React.DragEvent, date: Date) => {
    e.preventDefault()
    setDragOverDate(date)
  }

  const handleDrop = (_: React.DragEvent, date: Date) => {
    if (!draggedEvent) return

    const original = new Date(draggedEvent.date)
    const newDate = new Date(date)
    newDate.setHours(original.getHours(), original.getMinutes(), 0, 0)

    onMoveEvent(draggedEvent.id, newDate)

    setDraggedEvent(null)
    setDragOverDate(null)
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {DAYS.map((day) => (
          <div
            key={day}
            className="px-2 py-3 text-center text-xs font-semibold text-muted-foreground uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6">
        {days.map((date, i) => (
          <div
            key={i}
            className={`border p-1 ${
              date ? "hover:bg-secondary/30 cursor-pointer" : "bg-secondary/10"
            }`}
            onClick={() => date && onDateSelect(date)}
            onDoubleClick={() => date && onCreateEvent(date)}
            onDragOver={(e) => date && handleDragOver(e, date)}
            onDrop={(e) => date && handleDrop(e, date)}
          >
            {date && (
              <>
                <div
                  className={`w-7 h-7 flex items-center justify-center mb-1 ${
                    isToday(date)
                      ? "bg-foreground text-background rounded-full"
                      : ""
                  }`}
                >
                  {date.getDate()}
                </div>

                {getEventsForDate(date)
                  .slice(0, 3)
                  .map((event) => {
                    const color = getMemberColor(event.creatorId)
                    return (
                      <button
                        key={event.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, event)}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventClick(event)
                        }}
                        className="w-full text-left text-xs truncate pl-2 py-0.5 border-l-[3px]"
                        style={{
                          borderLeftColor: color,
                          backgroundColor: `${color}15`,
                        }}
                      >
                        {event.title}
                      </button>
                    )
                  })}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
