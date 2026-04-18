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
import { AvatarGroup } from "@/components/ui/avatar"
import { Sparkles } from "lucide-react"

// Get time-appropriate greeting
function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export function HomePage() {
  const [selectedDate, setSelectedDate] = useState(
    startOfDay(new Date())
  )

  const hub = useHub()
  const home = useHomeData()

  // Sample family members for avatar display
  const familyMembers = [
    { name: "Mom", id: "mom-1" },
    { name: "Dad", id: "dad-2" },
    { name: "Alex", id: "alex-3" },
    { name: "Sam", id: "sam-4" },
  ]

  // -----------------------------
  // Loading / error states
  // -----------------------------
  if (hub.loading || home.loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl icon-bg-coral flex items-center justify-center animate-pulse">
          <Sparkles className="w-8 h-8" />
        </div>
        <p className="text-lg text-muted-foreground font-medium">Loading your family hub...</p>
      </div>
    )
  }

  if (!hub.hub) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl icon-bg-lavender flex items-center justify-center">
          <Sparkles className="w-8 h-8" />
        </div>
        <p className="text-lg text-muted-foreground font-medium">Not paired yet</p>
      </div>
    )
  }

  if (hub.error || home.error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-destructive" />
        </div>
        <p className="text-lg text-destructive font-medium">Something went wrong</p>
      </div>
    )
  }

  // -----------------------------
  // Main layout
  // -----------------------------
  return (
    <div className="h-screen flex flex-col gap-5 p-4 overflow-hidden">
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-foreground">
            {getGreeting()}, Family!
          </h1>
          <p className="text-sm text-muted-foreground">
            {"Here's"} what{"'s"} happening in your home today
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AvatarGroup members={familyMembers} size="md" />
        </div>
      </div>

      {/* Clock and weather row */}
      <div className="flex flex-wrap items-center gap-4">
        <LiveClock />
        <WeatherWidget />
      </div>

      {/* Quick stats */}
      <QuickStats {...home.stats} />

      {/* Calendar and events grid */}
      <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-4 flex-1 min-h-0">
        <MiniCalendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          events={home.events}
        />

        <UpcomingEvents
          selectedDate={selectedDate}
          events={home.events}
        />
      </div>
    </div>
  )
}
