"use client"

import { useEffect, useState } from "react"
import {
  fetchCalendars,
  fetchCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "@/api/calender"

import type { Calendar, CalendarEvent } from "@/app/(calendar)/types"
import { useHub } from "@/providers/hub"

export function useCalendarData() {
  const { hubId, loading: hubLoading } = useHub()

  const [calendars, setCalendars] = useState<Calendar[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* =======================
   * LOAD DATA
   * ======================= */
  useEffect(() => {
    if (hubLoading) return

    // Hub unloaded / logged out
    if (!hubId) {
      setCalendars([])
      setEvents([])
      setLoading(false)
      setError(null)
      return
    }

    let alive = true

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const calRes = await fetchCalendars(hubId as string)
        if (!alive) return

        setCalendars(calRes.calendars)

        const groups = await Promise.all(
          calRes.calendars.map((cal) =>
            fetchCalendarEvents(hubId as string, cal.id).then((r) => r.events)
          )
        )

        if (!alive) return

        setEvents(
          groups.flat().map((e) => ({
            id: e.id,
            title: e.title,
            calendarId: e.calendarId,
            creatorId: e.creatorId ?? null,
            date: new Date(e.date),
            endDate: new Date(e.endDate),
            calendarColor: e.calendarColor ?? null,
          }))
        )
      } catch (e: any) {
        console.error("[useCalendarData]", e)
        if (alive) {
          setCalendars([])
          setEvents([])
          setError(e?.message ?? "Failed to load calendars")
        }
      } finally {
        if (alive) setLoading(false)
      }
    }

    load()
    return () => {
      alive = false
    }
  }, [hubId, hubLoading])

  /* =======================
   * MUTATIONS
   * ======================= */

  async function createEvent(
    calendarId: string,
    data: Omit<CalendarEvent, "id">
  ) {
    if (!hubId) return

    const { event } = await createCalendarEvent(hubId, calendarId, {
      title: data.title,
      date: data.date,
      endDate: data.endDate,
      creatorId: data.creatorId ?? null,
    })

    setEvents((prev) => [
      ...prev,
      {
        id: event.id,
        title: event.title,
        calendarId: event.calendarId,
        creatorId: event.creatorId ?? null,
        date: new Date(event.date),
        endDate: new Date(event.endDate),
        calendarColor: event.calendarColor ?? null,
      },
    ])
  }

  async function updateEvent(
    calendarId: string,
    eventId: string,
    data: Partial<CalendarEvent>
  ) {
    if (!hubId) return

    const { event } = await updateCalendarEvent(
      hubId,
      calendarId,
      eventId,
      {
        title: data.title,
        date: data.date,
        endDate: data.endDate,
      }
    )

    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              title: event.title,
              creatorId: event.creatorId ?? null,
              date: new Date(event.date),
              endDate: new Date(event.endDate),
              calendarColor: event.calendarColor ?? null,
            }
          : e
      )
    )
  }

  async function removeEvent(calendarId: string, eventId: string) {
    if (!hubId) return
    await deleteCalendarEvent(hubId, calendarId, eventId)
    setEvents((prev) => prev.filter((e) => e.id !== eventId))
  }

  return {
    calendars,
    setCalendars, // ✅ REQUIRED by CalendarPage
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    removeEvent,
  }
}
