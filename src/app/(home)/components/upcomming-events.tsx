"use client"

import { Clock, CalendarDays } from "lucide-react"
import { formatTimeLabel, isSameDay } from "@/lib/home/normalize"
import { HomeEvent } from "@/hooks/useHomeData"

export function UpcomingEvents(props: { selectedDate: Date; events: HomeEvent[] }) {
  const filtered = props.events
    .filter((e) => isSameDay(e.start, props.selectedDate))
    .sort((a, b) => a.start.getTime() - b.start.getTime())

  const formattedDate = props.selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  })

  const isToday = isSameDay(props.selectedDate, new Date())

  return (
    <div className="glass rounded-2xl p-4 shadow-lg flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            {isToday ? "Today's Schedule" : "Schedule"}
          </h3>
        </div>

        {!isToday && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground glass rounded-xl px-3 py-1.5">
            <CalendarDays className="w-3.5 h-3.5" />
            {formattedDate}
          </div>
        )}
        {isToday && (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-primary/15 text-primary">
            {formattedDate}
          </span>
        )}
      </div>

      {/* Events list */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-2 pr-1">
        {filtered.length > 0 ? (
          filtered.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-3 p-3 rounded-2xl glass hover:bg-white/30 transition-colors cursor-pointer group"
            >
              {/* Color bar */}
              <div
                className="w-1.5 self-stretch rounded-full flex-shrink-0"
                style={{ backgroundColor: event.color ?? "var(--primary)" }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {event.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatTimeLabel(event.start)} – {formatTimeLabel(event.end)}
                </p>
              </div>
              {/* Time pill */}
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-xl flex-shrink-0 text-white"
                style={{ backgroundColor: event.color ?? "var(--primary)" }}
              >
                {formatTimeLabel(event.start)}
              </span>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-3">
            <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center">
              <CalendarDays className="w-7 h-7 opacity-40" />
            </div>
            <p className="text-sm font-medium">Nothing planned</p>
            <p className="text-xs opacity-60">Enjoy your free time!</p>
          </div>
        )}
      </div>
    </div>
  )
}
