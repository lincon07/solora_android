export interface HubMember {
  id: string
  name: string
  color: string
}

export interface Calendar {
  id: string
  name: string
  ownerId: string
  memberIds: string[]
  color: string
}

export interface CalendarEvent {
  id: string
  title: string
  date: Date
  endDate: Date
  calendarId: string

  // ✅ IMPORTANT: backend can return null (created_by_member_id is nullable)
  creatorId: string | null

  // optional extras
  calendarColor?: string | null
  description?: string
  allDay?: boolean
}
