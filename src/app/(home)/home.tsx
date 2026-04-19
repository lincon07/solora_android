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
import { Mascot } from "@/components/ui/mascot"

// Get time-appropriate greeting with fun messages
function getGreeting(): { greeting: string; emoji: string } {
  const hour = new Date().getHours()
  if (hour < 12) return { greeting: "Good morning", emoji: "Rise and shine!" }
  if (hour < 17) return { greeting: "Good afternoon", emoji: "Keep up the great work!" }
  return { greeting: "Good evening", emoji: "Time to relax!" }
}

// Get mascot type based on time
function getMascotType(): "sunny" | "star" | "cloud" {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 18) return "sunny"
  if (hour >= 18 && hour < 21) return "cloud"
  return "star"
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

  const { greeting, emoji } = getGreeting()
  const mascotType = getMascotType()

  // -----------------------------
  // Loading / error states
  // -----------------------------
  if (hub.loading || home.loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-6 relative">
        <Mascot type="sunny" size="xl" mood="excited" />
        <p className="text-xl text-foreground font-bold">Loading your family hub...</p>
        <div className="flex gap-2">
          <div className="w-4 h-4 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-4 h-4 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-4 h-4 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    )
  }

  if (!hub.hub) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-6 relative">
        <Mascot type="house" size="xl" mood="thinking" />
        <p className="text-xl text-foreground font-bold">Not paired yet</p>
        <p className="text-muted-foreground">Let&apos;s connect your smart home!</p>
      </div>
    )
  }

  if (hub.error || home.error) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-6 relative">
        <Mascot type="cloud" size="xl" mood="sleepy" />
        <p className="text-xl text-destructive font-bold">Oops! Something went wrong</p>
        <p className="text-muted-foreground">Don&apos;t worry, we&apos;ll fix it!</p>
      </div>
    )
  }

  // -----------------------------
  // Main layout
  // -----------------------------
  return (
    <div className="h-full flex flex-col gap-4 p-5 overflow-hidden relative">

      {/* Welcome header — frosted glass pill */}
      <div className="flex items-center justify-between glass rounded-2xl px-5 py-3 shadow-md">
        <div className="flex items-center gap-4">
          <Mascot type={mascotType} size="md" mood="happy" />
          <div className="flex flex-col gap-0.5">
            <h1 className="text-2xl font-extrabold text-foreground">
              {greeting}, <span className="text-rainbow">Family!</span>
            </h1>
            <p className="text-sm text-muted-foreground font-medium">{emoji}</p>
          </div>
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
      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4 flex-1 min-h-0">
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
