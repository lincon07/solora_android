"use client"

import React, { useState, useRef, useEffect } from "react"
import type { CalendarEvent, Calendar, HubMember } from "../../types"

interface DayViewProps {
  currentDate: Date
  events: CalendarEvent[]
  calendars: Calendar[] // keep if you want; otherwise remove from props + calls
  members: HubMember[]
  onEventClick: (event: CalendarEvent) => void
  onCreateEvent: (date: Date) => void
  onMoveEvent: (eventId: string, newDate: Date) => void
  scrollToNow?: boolean
}

export function DayView({
  currentDate,
  events,
  members,
  onEventClick,
  onCreateEvent,
  onMoveEvent,
  scrollToNow,
}: DayViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null)
  const [dragOverHour, setDragOverHour] = useState<number | null>(null)

  useEffect(() => {
    if (scrollRef.current) {
      const currentHour = new Date().getHours()
      const scrollTarget = Math.max(0, currentHour - 2) * 64
      scrollRef.current.scrollTo({ top: scrollTarget, behavior: "smooth" })
    }
  }, [scrollToNow])

  const hours = Array.from({ length: 24 }, (_, i) => i)

  const dayEvents = events.filter((event) => {
    const eventDate = new Date(event.date)
    return (
      eventDate.getFullYear() === currentDate.getFullYear() &&
      eventDate.getMonth() === currentDate.getMonth() &&
      eventDate.getDate() === currentDate.getDate()
    )
  })

  // ✅ FIX: allow null
  const getMemberColor = (creatorId: string | null) => {
    if (!creatorId) return "#ffffff"
    return members.find((m) => m.id === creatorId)?.color || "#ffffff"
  }

  // ✅ FIX: allow null
  const getMemberName = (creatorId: string | null) => {
    if (!creatorId) return "System"
    return members.find((m) => m.id === creatorId)?.name || "Unknown"
  }

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM"
    if (hour === 12) return "12 PM"
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`
  }

  const getEventPosition = (event: CalendarEvent) => {
    const eventDate = new Date(event.date)
    const endDate = new Date(event.endDate)
    const startHour = eventDate.getHours() + eventDate.getMinutes() / 60
    const endHour = endDate.getHours() + endDate.getMinutes() / 60
    const duration = endHour - startHour

    return {
      top: `${startHour * 64}px`,
      height: `${Math.max(duration * 64, 32)}px`,
    }
  }

  const handleHourClick = (hour: number) => {
    const date = new Date(currentDate)
    date.setHours(hour, 0, 0, 0)
    onCreateEvent(date)
  }

  const handleDragStart = (e: React.DragEvent, event: CalendarEvent) => {
    setDraggedEvent(event)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", event.id)
  }

  const handleDragOver = (e: React.DragEvent, hour: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverHour(hour)
  }

  const handleDragLeave = () => {
    setDragOverHour(null)
  }

  const handleDrop = (e: React.DragEvent, hour: number) => {
    e.preventDefault()
    if (draggedEvent) {
      const newDate = new Date(currentDate)
      newDate.setHours(hour, 0, 0, 0)
      onMoveEvent(draggedEvent.id, newDate)
    }
    setDraggedEvent(null)
    setDragOverHour(null)
  }

  const handleDragEnd = () => {
    setDraggedEvent(null)
    setDragOverHour(null)
  }

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto scroll-smooth">
      <div className="relative min-h-full">
        <div className="absolute left-0 top-0 w-16 border-r border-border">
          {hours.map((hour) => (
            <div key={hour} className="h-16 flex items-start justify-end pr-2 pt-0">
              <span className="text-xs text-muted-foreground -mt-2">
                {formatHour(hour)}
              </span>
            </div>
          ))}
        </div>

        <div className="ml-16 relative">
          {hours.map((hour) => (
            <div
              key={hour}
              className={`h-16 border-b border-border cursor-pointer transition-colors ${
                dragOverHour === hour ? "bg-secondary/50" : "hover:bg-secondary/20"
              }`}
              onClick={() => handleHourClick(hour)}
              onDragOver={(e) => handleDragOver(e, hour)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, hour)}
            />
          ))}

          {dayEvents.map((event) => {
            const position = getEventPosition(event)
            const memberColor = getMemberColor(event.creatorId)

            return (
              <button
                key={event.id}
                draggable
                onDragStart={(e) => handleDragStart(e, event)}
                onDragEnd={handleDragEnd}
                onClick={() => onEventClick(event)}
                className="absolute left-2 right-2 rounded-lg pl-3 pr-2 py-2 overflow-hidden text-left transition-all hover:opacity-90 border-l-4 cursor-grab active:cursor-grabbing"
                style={{
                  top: position.top,
                  height: position.height,
                  borderLeftColor: memberColor,
                  backgroundColor: `${memberColor}15`,
                }}
              >
                <p className="font-medium text-sm truncate text-foreground">
                  {event.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {getMemberName(event.creatorId)}
                </p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
