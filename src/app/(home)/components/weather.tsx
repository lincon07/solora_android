"use client"

import React from "react"
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, Droplets, MapPin } from "lucide-react"

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

const weatherConfig: Record<WeatherType, { icon: React.ReactNode; bgClass: string; label: string }> = {
  sunny: { 
    icon: <Sun className="w-7 h-7" />, 
    bgClass: "icon-bg-sunny",
    label: "Sunny"
  },
  cloudy: { 
    icon: <Cloud className="w-7 h-7" />, 
    bgClass: "icon-bg-sky",
    label: "Cloudy"
  },
  rainy: { 
    icon: <CloudRain className="w-7 h-7" />, 
    bgClass: "icon-bg-teal",
    label: "Rainy"
  },
  snowy: { 
    icon: <CloudSnow className="w-7 h-7" />, 
    bgClass: "icon-bg-lavender",
    label: "Snowy"
  },
  stormy: { 
    icon: <CloudLightning className="w-7 h-7" />, 
    bgClass: "icon-bg-lavender",
    label: "Stormy"
  },
  windy: { 
    icon: <Wind className="w-7 h-7" />, 
    bgClass: "icon-bg-mint",
    label: "Windy"
  },
}

export function WeatherWidget() {
  const config = weatherConfig[weather.type]

  return (
    <div className="flex items-center gap-5 bg-card border border-border rounded-2xl px-5 py-4 shadow-sm card-interactive">
      {/* Weather icon with colorful background */}
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${config.bgClass}`}>
        {config.icon}
      </div>

      {/* Temperature and condition */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-foreground">{weather.temp}</span>
          <span className="text-lg text-muted-foreground font-medium">°F</span>
        </div>
        <span className="text-sm text-muted-foreground font-medium">{config.label}</span>
      </div>

      <div className="h-12 w-px bg-border/60" />

      {/* High/Low */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-8">High</span>
          <span className="text-sm font-semibold text-foreground">{weather.high}°</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-8">Low</span>
          <span className="text-sm font-semibold text-foreground">{weather.low}°</span>
        </div>
      </div>

      <div className="h-12 w-px bg-border/60" />

      {/* Humidity */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg icon-bg-teal flex items-center justify-center">
          <Droplets className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">{weather.humidity}%</span>
          <span className="text-xs text-muted-foreground">Humidity</span>
        </div>
      </div>

      <div className="h-12 w-px bg-border/60" />

      {/* Location */}
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground font-medium">{weather.location}</span>
      </div>
    </div>
  )
}
