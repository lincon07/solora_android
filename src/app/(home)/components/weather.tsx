"use client"

import React from "react"
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, Droplets } from "lucide-react"

type WeatherType = "sunny" | "cloudy" | "rainy" | "snowy" | "stormy" | "windy"

interface WeatherData {
  type: WeatherType
  temp: number
  high: number
  low: number
  humidity: number
  location: string
}

const weather: WeatherData = {
  type: "sunny",
  temp: 72,
  high: 78,
  low: 65,
  humidity: 45,
  location: "San Francisco",
}

const weatherIcons: Record<WeatherType, React.ReactNode> = {
  sunny: <Sun className="w-8 h-8" />,
  cloudy: <Cloud className="w-8 h-8" />,
  rainy: <CloudRain className="w-8 h-8" />,
  snowy: <CloudSnow className="w-8 h-8" />,
  stormy: <CloudLightning className="w-8 h-8" />,
  windy: <Wind className="w-8 h-8" />,
}

export function WeatherWidget() {
  return (
    <div className="flex items-center gap-6 bg-card/50 border border-border rounded-2xl px-6 py-3">
      <div className="flex items-center gap-3">
        <div className="text-foreground">{weatherIcons[weather.type]}</div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-light text-foreground">{weather.temp}</span>
          <span className="text-lg text-muted-foreground">°F</span>
        </div>
      </div>

      <div className="h-8 w-px bg-border" />

      <div className="flex items-center gap-4 text-sm">
        <div className="text-center">
          <p className="text-muted-foreground text-xs">High</p>
          <p className="text-foreground font-medium">{weather.high}°</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground text-xs">Low</p>
          <p className="text-foreground font-medium">{weather.low}°</p>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Droplets className="w-3 h-3" />
          <span className="text-foreground font-medium">{weather.humidity}%</span>
        </div>
      </div>

      <div className="h-8 w-px bg-border" />

      <p className="text-sm text-muted-foreground">{weather.location}</p>
    </div>
  )
}
