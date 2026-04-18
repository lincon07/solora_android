import { api } from "./client"

/* ======================================================
 * TYPES (CLIENT CONTRACT)
 * ====================================================== */

export type HubCalendar = {
  id: string
  name: string
  color: string
  ownerId: string
  memberIds: string[]
}

export type CalendarEvent = {
  id: string
  title: string
  date: string
  endDate: string
  calendarId: string

  // ✅ DB + backend allow null
  creatorId: string | null

  calendarColor?: string | null
}

/* ======================================================
 * INPUT TYPES
 * ====================================================== */

export type CreateCalendarInput = {
  name: string
  color: string
  ownerId: string
  memberIds: string[]
}

export type UpdateCalendarInput = {
  name?: string
  color?: string
  ownerId?: string
  memberIds?: string[]
}

export type CreateEventInput = {
  title: string
  date: Date | string
  endDate: Date | string

  // ✅ FIXED
  creatorId?: string | null
}

export type UpdateEventInput = {
  title?: string
  date?: Date | string
  endDate?: Date | string
}

/* ======================================================
 * CALENDARS
 * ====================================================== */

export function fetchCalendars(hubId: string) {
  return api<{ calendars: HubCalendar[] }>(
    `/hub/${hubId}/calendars`
  )
}

export function createCalendar(
  hubId: string,
  data: CreateCalendarInput
) {
  return api<{ calendar: HubCalendar }>(
    `/hub/${hubId}/calendars`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  )
}

export function updateCalendar(
  hubId: string,
  calendarId: string,
  data: UpdateCalendarInput
) {
  return api<{ calendar: HubCalendar }>(
    `/hub/${hubId}/calendars/${calendarId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  )
}

export function deleteCalendar(hubId: string, calendarId: string) {
  return api<void>(
    `/hub/${hubId}/calendars/${calendarId}`,
    { method: "DELETE" }
  )
}

/* ======================================================
 * EVENTS
 * ====================================================== */

export function fetchCalendarEvents(
  hubId: string,
  calendarId: string
) {
  return api<{ events: CalendarEvent[] }>(
    `/hub/${hubId}/calendars/${calendarId}/events`
  )
}

export function createCalendarEvent(
  hubId: string,
  calendarId: string,
  data: CreateEventInput
) {
  return api<{ event: CalendarEvent }>(
    `/hub/${hubId}/calendars/${calendarId}/events`,
    {
      method: "POST",
      body: JSON.stringify({
        title: data.title,
        date: data.date instanceof Date
          ? data.date.toISOString()
          : data.date,
        endDate: data.endDate instanceof Date
          ? data.endDate.toISOString()
          : data.endDate,
        creatorId: data.creatorId ?? null,
      }),
    }
  )
}

export function updateCalendarEvent(
  hubId: string,
  calendarId: string,
  eventId: string,
  data: UpdateEventInput
) {
  return api<{ event: CalendarEvent }>(
    `/hub/${hubId}/calendars/${calendarId}/events/${eventId}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.date !== undefined
          ? {
              date:
                data.date instanceof Date
                  ? data.date.toISOString()
                  : data.date,
            }
          : {}),
        ...(data.endDate !== undefined
          ? {
              endDate:
                data.endDate instanceof Date
                  ? data.endDate.toISOString()
                  : data.endDate,
            }
          : {}),
      }),
    }
  )
}

export function deleteCalendarEvent(
  hubId: string,
  calendarId: string,
  eventId: string
) {
  return api<void>(
    `/hub/${hubId}/calendars/${calendarId}/events/${eventId}`,
    { method: "DELETE" }
  )
}
