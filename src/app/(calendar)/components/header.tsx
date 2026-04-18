"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, MoreHorizontal } from "lucide-react"
import type { Calendar, HubMember } from "../types"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CalendarHeaderProps {
  currentDate: Date
  view: "day" | "month" | "year"
  calendars: Calendar[]
  members: HubMember[]
  visibleCalendarIds: string[]
  onToggleCalendar: (id: string) => void
  onCreateEvent: () => void
  onViewChange: (v: "day" | "month" | "year") => void

  // ✅ calendar modal wiring
  onCreateCalendar: () => void
  onEditCalendar: (calendar: Calendar) => void
}

export function CalendarHeader({
  currentDate,
  view,
  calendars,
  members,
  visibleCalendarIds,
  onToggleCalendar,
  onCreateEvent,
  onViewChange,
  onCreateCalendar,
  onEditCalendar,
}: CalendarHeaderProps) {
  return (
    <header className="border-b border-border px-4 py-3 flex flex-col gap-3 flex-shrink-0">
      {/* Top row */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">
          {currentDate.toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })}
        </h1>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Button
            variant={view === "day" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange("day")}
          >
            Day
          </Button>
          <Button
            variant={view === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange("month")}
          >
            Month
          </Button>
          <Button
            variant={view === "year" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange("year")}
          >
            Year
          </Button>

          <Button onClick={onCreateEvent} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Event
          </Button>

          <Button onClick={onCreateCalendar} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Calendar
          </Button>
        </div>
      </div>

      {/* Calendars row */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        {calendars.map((cal) => {
          const checked = visibleCalendarIds.includes(cal.id)

          return (
            <div key={cal.id} className="flex items-center gap-2 shrink-0">
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => onToggleCalendar(cal.id)}
                  style={{
                    backgroundColor: checked ? cal.color : undefined,
                    borderColor: cal.color,
                  }}
                />
                <span className="truncate max-w-[160px]">{cal.name}</span>
              </label>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border-border">
                  <DropdownMenuItem onClick={() => onEditCalendar(cal)}>
                    Edit calendar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        })}
      </div>

      {/* Members row */}
      {members.length > 0 && (
        <div className="flex items-center gap-3 text-xs text-muted-foreground overflow-x-auto pb-1">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-1 shrink-0">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: m.color }}
              />
              {m.name}
            </div>
          ))}
        </div>
      )}
    </header>
  )
}
