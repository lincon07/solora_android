"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

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

  return (
    <div className="bg-card border border-border rounded-2xl px-5 py-4 shadow-sm card-interactive">
      <div className="flex items-center gap-4">
        {/* Clock icon */}
        <div className="w-12 h-12 rounded-xl icon-bg-coral flex items-center justify-center">
          <Clock className="w-6 h-6" />
        </div>
        
        {/* Time display */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground tracking-tight tabular-nums">
              {formatTime(time).split(" ")[0]}
            </span>
            <span className="text-lg font-medium text-muted-foreground">
              {formatTime(time).split(" ")[1]}
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-medium">{formatDate(time)}</p>
        </div>
      </div>

      {/* Progress bar for seconds */}
      <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary/60 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${(seconds / 60) * 100}%` }}
        />
      </div>
    </div>
  )
}
