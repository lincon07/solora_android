"use client"

import { useEffect, useState } from "react"

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
    <div className="text-center">
      <div className="flex items-baseline justify-center gap-2">
        <span className="text-7xl font-light text-foreground tracking-tight tabular-nums">
          {formatTime(time).split(" ")[0]}
        </span>
        <span className="text-3xl font-light text-muted-foreground">
          {formatTime(time).split(" ")[1]}
        </span>
      </div>
      <p className="text-lg text-muted-foreground mt-2">{formatDate(time)}</p>

      <div className="mt-3 mx-auto h-1 bg-secondary rounded-full overflow-hidden w-48">
        <div
          className="h-full bg-foreground/50 transition-all duration-1000 ease-linear"
          style={{ width: `${(seconds / 60) * 100}%` }}
        />
      </div>
    </div>
  )
}
