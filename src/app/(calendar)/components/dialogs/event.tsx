"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2 } from "lucide-react"
import type { CalendarEvent, Calendar, HubMember } from "../../types"

/* =========================
 * LOCAL DATE HELPERS (CRITICAL)
 * ========================= */
function toLocalDateInputValue(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function fromLocalDateInput(value: string) {
  const [y, m, d] = value.split("-").map(Number)
  return new Date(y, m - 1, d)
}

interface EventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: CalendarEvent | null
  selectedDate: Date | null
  calendars: Calendar[]
  members: HubMember[]
  onSave: (event: Omit<CalendarEvent, "id">) => void
  onDelete: (eventId: string) => void
}

export function EventDialog({
  open,
  onOpenChange,
  event,
  selectedDate,
  calendars,
  members,
  onSave,
  onDelete,
}: EventDialogProps) {
  const [title, setTitle] = useState("")
  const [calendarId, setCalendarId] = useState("")
  const [creatorId, setCreatorId] = useState<string | null>(null)
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")

  useEffect(() => {
    if (event) {
      const start = new Date(event.date)
      const end = new Date(event.endDate)

      setTitle(event.title)
      setCalendarId(event.calendarId)
      setCreatorId(event.creatorId ?? null)
      setDate(toLocalDateInputValue(start))
      setStartTime(
        `${start.getHours().toString().padStart(2, "0")}:${start
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      )
      setEndTime(
        `${end.getHours().toString().padStart(2, "0")}:${end
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      )
    } else if (selectedDate) {
      setTitle("")
      setCalendarId(calendars[0]?.id ?? "")
      setCreatorId(members[0]?.id ?? null)

      setDate(toLocalDateInputValue(selectedDate))
      const h = selectedDate.getHours()
      setStartTime(`${h.toString().padStart(2, "0")}:00`)
      setEndTime(`${(h + 1).toString().padStart(2, "0")}:00`)
    }
  }, [event, selectedDate, calendars, members])

  const handleSave = () => {
    if (!title || !calendarId || !date) return

    const [sh, sm] = startTime.split(":").map(Number)
    const [eh, em] = endTime.split(":").map(Number)

    const base = fromLocalDateInput(date)

    const start = new Date(base)
    start.setHours(sh, sm, 0, 0)

    const end = new Date(base)
    end.setHours(eh, em, 0, 0)

    onSave({
      title: title.trim(),
      calendarId,
      creatorId,
      date: start,
      endDate: end,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "New Event"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />

          <Label>Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

          <div className="grid grid-cols-2 gap-2">
            <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>

          <Label>Calendar</Label>
          <Select value={calendarId} onValueChange={setCalendarId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {calendars.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Created by</Label>
          <Select value={creatorId ?? ""} onValueChange={(v) => setCreatorId(v || null)}>
            <SelectTrigger>
              <SelectValue placeholder="Optional" />
            </SelectTrigger>
            <SelectContent>
              {members.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-between pt-4">
          {event && (
            <Button variant="ghost" onClick={() => onDelete(event.id)}>
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          )}
          <Button onClick={handleSave}>{event ? "Save" : "Create"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
