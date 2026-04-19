"use client"

import { useEffect, useState } from "react"
import { Mascot } from "@/components/ui/mascot"

export function LiveClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })

  const seconds = time.getSeconds()
  const hour = time.getHours()
  
  // Choose mascot based on time of day
  const getMascotType = () => {
    if (hour >= 6 && hour < 18) return "sunny"
    if (hour >= 18 && hour < 21) return "cloud"
    return "star"
  }

  return (
    <div className="glass rounded-3xl px-5 py-4 shadow-lg card-interactive overflow-hidden relative">
      
      <div className="flex items-center gap-4 relative z-10">
        {/* Animated mascot instead of static icon */}
        <div className="w-14 h-14 flex items-center justify-center">
          <Mascot type={getMascotType()} size="sm" mood="happy" />
        </div>
        
        {/* Time display with playful styling */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-extrabold text-foreground tracking-tight tabular-nums">
              {formatTime(time).split(" ")[0]}
            </span>
            <span className="text-lg font-bold text-primary">
              {formatTime(time).split(" ")[1]}
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-semibold">{formatDate(time)}</p>
        </div>
      </div>

      {/* Rainbow progress bar for seconds */}
      <div className="mt-4 h-2.5 bg-muted rounded-full overflow-hidden relative z-10">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-linear"
          style={{ 
            width: `${(seconds / 60) * 100}%`,
            background: 'linear-gradient(90deg, oklch(0.7500 0.2000 350), oklch(0.8000 0.1800 55), oklch(0.9000 0.1600 95), oklch(0.7500 0.1800 145), oklch(0.7000 0.1600 240))'
          }}
        />
      </div>
    </div>
  )
}
