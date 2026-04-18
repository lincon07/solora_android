"use client"

import { useState } from "react"
import { startOfDay } from "@/lib/home/normalize"

import { useHomeData } from "@/hooks/useHomeData"
import { useHub } from "@/providers/hub"

import { LiveClock } from "./components/live-clock"
import { WeatherWidget } from "./components/weather"
import { QuickStats } from "./components/quick-staats"
import { MiniCalendar } from "./components/mini-calendar"
import { UpcomingEvents } from "./components/upcomming-events"

export function HomePage() {
  const [selectedDate, setSelectedDate] = useState(
    startOfDay(new Date())
  )

  const hub = useHub()
  const home = useHomeData()

  // -----------------------------
  // Loading / error states
  // -----------------------------
  if (hub.loading || home.loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading…
      </div>
    )
  }

  if (!hub.hub) {
    return (
      <div className="h-screen flex items-center justify-center">
        Not paired
      </div>
    )
  }

  if (hub.error || home.error) {
    return (
      <div className="h-screen flex items-center justify-center">
        Error
      </div>
    )
  }

  // -----------------------------
  // Main layout
  // -----------------------------
  return (
    <div className="h-screen flex flex-col gap-4 p-4 overflow-hidden">
      {/* Top widgets */}
      <LiveClock />
      <WeatherWidget />
      <QuickStats {...home.stats} />

      {/* ✅ MINI CALENDAR + UPCOMING EVENTS INLINE */}
      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4 min-h-[280px]">
        <MiniCalendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          events={home.events}
        />

        <h2>
          {window?.location?.href}
        </h2>

        <UpcomingEvents
          selectedDate={selectedDate}
          events={home.events}
        />
      </div>

    </div>
  )
}
