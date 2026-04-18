"use client"

import { Clock, CalendarDays } from "lucide-react"
import { formatTimeLabel, isSameDay } from "@/lib/home/normalize"
import { HomeEvent } from "@/hooks/useHomeData";

export function UpcomingEvents(props: { selectedDate: Date; events: HomeEvent[] }) {
  const filtered = props.events
    .filter((e) => isSameDay(e.start, props.selectedDate))
    .sort((a, b) => a.start.getTime() - b.start.getTime())

  const formattedDate = props.selectedDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  const isToday = isSameDay(props.selectedDate, new Date())

  return (
    <div className="flex-1 bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            {isToday ? "Today's Schedule" : "Schedule"}
          </h3>
        </div>

        {!isToday && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="w-3 h-3" />
            {formattedDate}
          </div>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
            >
              <div className="w-1 h-8 rounded-full" style={{ backgroundColor: event.color ?? "#fff" }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatTimeLabel(event.start)} – {formatTimeLabel(event.end)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
          <CalendarDays className="w-8 h-8 mb-2 opacity-50" />
          <p className="text-sm">No events scheduled</p>
        </div>
      )}
    </div>
  )
}
