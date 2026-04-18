"use client"

import { useEffect, useMemo, useState } from "react"

import { CalendarHeader } from "./components/header"
import { MonthView } from "./components/views/month"
import { YearView } from "./components/views/year"
import { DayView } from "./components/views/day"
import { EventDialog } from "./components/dialogs/event"
import { CalendarDialog } from "./components/dialogs/calendar"

import { useCalendarData } from "@/hooks/useCalendarData"

import type { CalendarEvent, Calendar, HubMember } from "./types"
import { createCalendar, updateCalendar, deleteCalendar } from "@/api/calender"
import { useHub } from "@/providers/hub"

export type ViewType = "day" | "month" | "year"

function colorFromId(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0
  return `hsl(${Math.abs(hash) % 360} 80% 60%)`
}

export function CalendarPage() {
  const { hubId, loading: hubLoading, members: hubMembers } = useHub()

  const {
    calendars,
    events,
    loading: calendarLoading,
    createEvent,
    updateEvent,
    removeEvent,
    setCalendars,
  } = useCalendarData()

  const members: HubMember[] = useMemo(
    () =>
      (hubMembers ?? []).map((m) => ({
        id: m.id,
        name: m.displayName ?? "Unknown",
        color: colorFromId(m.id),
      })),
    [hubMembers]
  )

  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<ViewType>("month")
  const [visibleCalendarIds, setVisibleCalendarIds] = useState<string[]>([])

  const [eventDialogOpen, setEventDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false)
  const [editingCalendar, setEditingCalendar] = useState<Calendar | null>(null)

  // Auto-show all calendars on first load
  useEffect(() => {
    if (!calendars.length) return
    setVisibleCalendarIds((prev) => (prev.length ? prev : calendars.map((c) => c.id)))
  }, [calendars])

  if (hubLoading || calendarLoading) {
    return <div className="p-6 text-muted-foreground">Loading…</div>
  }

  if (!hubId) {
    return <div className="p-6 text-destructive">No hub available</div>
  }

  const visibleEvents = events.filter((e) => visibleCalendarIds.includes(e.calendarId))

  function toggleCalendarVisibility(id: string) {
    setVisibleCalendarIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  function handleCreateEvent(date?: Date) {
    setEditingEvent(null)
    setSelectedDate(date ?? currentDate)
    setEventDialogOpen(true)
  }

  function handleEditEvent(event: CalendarEvent) {
    setEditingEvent(event)
    setSelectedDate(null)
    setEventDialogOpen(true)
  }

  async function handleSaveEvent(data: Omit<CalendarEvent, "id">) {
    if (editingEvent) {
      await updateEvent(data.calendarId, editingEvent.id, data)
    } else {
      await createEvent(data.calendarId, data)
    }
    setEventDialogOpen(false)
  }

  async function handleDeleteEvent(eventId: string) {
    const e = events.find((x) => x.id === eventId)
    if (!e) return
    await removeEvent(e.calendarId, eventId)
    setEventDialogOpen(false)
  }

  function handleMoveEvent(eventId: string, newDate: Date) {
    const e = events.find((x) => x.id === eventId)
    if (!e) return

    const duration = e.endDate.getTime() - e.date.getTime()

    updateEvent(e.calendarId, eventId, {
      date: newDate,
      endDate: new Date(newDate.getTime() + duration),
    })
  }

  async function handleSaveCalendarDraft(draft: Omit<Calendar, "id">) {
    if (!hubId) return

    const payload = {
      name: draft.name,
      color: draft.color,
      ownerId: draft.ownerId,
      memberIds: draft.memberIds,
    }

    if (editingCalendar) {
      const { calendar } = await updateCalendar(hubId, editingCalendar.id, payload)
      setCalendars((prev) => prev.map((c) => (c.id === calendar.id ? calendar : c)))
    } else {
      const { calendar } = await createCalendar(hubId, payload)
      setCalendars((prev) => [...prev, calendar])
      setVisibleCalendarIds((prev) => (prev.includes(calendar.id) ? prev : [...prev, calendar.id]))
    }

    setCalendarDialogOpen(false)
    setEditingCalendar(null)
  }

  async function handleDeleteCalendar(calendarId?: string) {
    const id = calendarId ?? editingCalendar?.id
    if (!hubId || !id) {
      setCalendarDialogOpen(false)
      setEditingCalendar(null)
      return
    }

    await deleteCalendar(hubId, id)

    setCalendars((prev) => prev.filter((c) => c.id !== id))
    setVisibleCalendarIds((prev) => prev.filter((x) => x !== id))

    setCalendarDialogOpen(false)
    setEditingCalendar(null)
  }

  return (
    // ✅ fits inside Layout main, no h-screen/w-screen
    <div className="flex flex-col h-full overflow-hidden">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        calendars={calendars}
        members={members}
        visibleCalendarIds={visibleCalendarIds}
        onToggleCalendar={toggleCalendarVisibility}
        onCreateEvent={() => handleCreateEvent()}
        onViewChange={setView}
        onCreateCalendar={() => {
          setEditingCalendar(null)
          setCalendarDialogOpen(true)
        }}
        onEditCalendar={(cal) => {
          setEditingCalendar(cal)
          setCalendarDialogOpen(true)
        }}
      />

      {/* ✅ single scroll area */}
      <main className="flex-1 overflow-auto">
        {view === "month" && (
          <MonthView
            currentDate={currentDate}
            events={visibleEvents}
            calendars={calendars}
            members={members}
            onDateSelect={(d) => {
              setCurrentDate(d)
              setView("day")
            }}
            onEventClick={handleEditEvent}
            onCreateEvent={handleCreateEvent}
            onMoveEvent={handleMoveEvent}
          />
        )}

        {view === "day" && (
          <DayView
            currentDate={currentDate}
            events={visibleEvents}
            calendars={calendars}
            members={members}
            onEventClick={handleEditEvent}
            onCreateEvent={handleCreateEvent}
            onMoveEvent={handleMoveEvent}
          />
        )}

        {view === "year" && (
          <YearView
            currentDate={currentDate}
            events={visibleEvents}
            onMonthSelect={(m) => {
              setCurrentDate(new Date(currentDate.getFullYear(), m, 1))
              setView("month")
            }}
          />
        )}
      </main>

      <EventDialog
        open={eventDialogOpen}
        onOpenChange={setEventDialogOpen}
        event={editingEvent}
        selectedDate={selectedDate}
        calendars={calendars}
        members={members}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />

      <CalendarDialog
        open={calendarDialogOpen}
        onOpenChange={setCalendarDialogOpen}
        calendar={editingCalendar}
        members={members}
        onSave={handleSaveCalendarDraft}
        onDelete={handleDeleteCalendar}
      />
    </div>
  )
}
