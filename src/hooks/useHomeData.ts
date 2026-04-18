"use client"

import { useEffect, useMemo, useState } from "react"

import { fetchCalendars, fetchCalendarEvents } from "@/api/calender"
import { fetchHubMembers } from "@/api/hub"
import { fetchTodos, Todo } from "@/api/todos"

import { toDate, isSameDay } from "@/lib/home/normalize"
import { HubMember } from "@/api/members"
import { useHub } from "@/providers/hub"

export type HomeEvent = {
  id: string
  title: string
  start: Date
  end: Date
  calendarId: string
  color?: string | null
}

export function useHomeData() {
  const { hubId, loading: hubLoading } = useHub()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [members, setMembers] = useState<HubMember[]>([])
  const [todosByMember, setTodosByMember] = useState<Record<string, Todo[]>>({})
  const [events, setEvents] = useState<HomeEvent[]>([])

  useEffect(() => {
    if (hubLoading) return
    if (!hubId) {
      setLoading(false)
      return
    }

    const activeHubId = hubId
    let alive = true

    async function run() {
      try {
        setLoading(true)
        setError(null)

        // Members
        const mRes = await fetchHubMembers(activeHubId)
        if (!alive) return
        setMembers(mRes.members)

        // Todos
        const todoPairs = await Promise.all(
          mRes.members.map(async (m) => {
            const res = await fetchTodos(activeHubId, m.id)
            return [m.id, res.todos] as const
          })
        )
        if (!alive) return
        setTodosByMember(Object.fromEntries(todoPairs))

        // Calendars → Events
        const cRes = await fetchCalendars(activeHubId)

        const all = await Promise.all(
          cRes.calendars.map(async (cal) => {
            const eRes = await fetchCalendarEvents(activeHubId, cal.id)
            return eRes.events.map((e) => ({
              id: e.id,
              title: e.title,
              start: toDate(e.date),
              end: toDate(e.endDate),
              calendarId: e.calendarId,
              color: e.calendarColor ?? cal.color ?? null,
            }))
          })
        )

        if (!alive) return
        setEvents(all.flat())
      } catch (e: any) {
        if (alive) setError(e?.message ?? "Failed to load home")
      } finally {
        if (alive) setLoading(false)
      }
    }

    run()
    return () => {
      alive = false
    }
  }, [hubId, hubLoading])

  const flatTodos = useMemo(
    () => Object.values(todosByMember).flat(),
    [todosByMember]
  )

  const stats = useMemo(() => {
    const total = flatTodos.length
    const done = flatTodos.filter((t) => t.completed).length
    const pending = total - done

    return {
      total,
      done,
      pending,
      activeMembers: members.length,
      avgHours: 0,
    }
  }, [flatTodos, members])

  return {
    loading,
    error,
    members,
    setMembers,
    todosByMember,
    setTodosByMember,
    events,
    stats,
    eventsForDay: (d: Date) => events.filter((e) => isSameDay(e.start, d)),
  }
}
