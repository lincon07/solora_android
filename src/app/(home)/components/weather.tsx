"use client"

import React from "react"
import { CloudRain, CloudSnow, CloudLightning, Wind, Droplets, MapPin } from "lucide-react"
import { Mascot } from "@/components/ui/mascot"

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

const weatherConfig: Record<WeatherType, { 
  mascot: "sunny" | "cloud" | "star"; 
  bgClass: string; 
  label: string;
  funMessage: string;
}> = {
  sunny: { 
    mascot: "sunny",
    bgClass: "bg-gradient-to-br from-[oklch(0.9400_0.1200_95)] to-[oklch(0.8800_0.1400_55)]",
    label: "Sunny",
    funMessage: "Perfect day to play outside!"
  },
  cloudy: { 
    mascot: "cloud",
    bgClass: "bg-gradient-to-br from-[oklch(0.9200_0.0600_220)] to-[oklch(0.8800_0.0800_240)]",
    label: "Cloudy",
    funMessage: "Great day for indoor fun!"
  },
  rainy: { 
    mascot: "cloud",
    bgClass: "bg-gradient-to-br from-[oklch(0.8800_0.1000_185)] to-[oklch(0.8200_0.1200_200)]",
    label: "Rainy",
    funMessage: "Puddle jumping time!"
  },
  snowy: { 
    mascot: "cloud",
    bgClass: "bg-gradient-to-br from-[oklch(0.9400_0.0400_260)] to-[oklch(0.9000_0.0600_280)]",
    label: "Snowy",
    funMessage: "Build a snowman!"
  },
  stormy: { 
    mascot: "cloud",
    bgClass: "bg-gradient-to-br from-[oklch(0.8500_0.1000_280)] to-[oklch(0.7800_0.1200_260)]",
    label: "Stormy",
    funMessage: "Stay cozy inside!"
  },
  windy: { 
    mascot: "cloud",
    bgClass: "bg-gradient-to-br from-[oklch(0.8800_0.1000_185)] to-[oklch(0.8500_0.1000_170)]",
    label: "Windy",
    funMessage: "Fly a kite!"
  },
}

// Fun weather icons for non-sunny weather
const weatherIcons: Record<WeatherType, React.ReactNode | null> = {
  sunny: null,
  cloudy: null,
  rainy: <CloudRain className="w-6 h-6" />,
  snowy: <CloudSnow className="w-6 h-6" />,
  stormy: <CloudLightning className="w-6 h-6" />,
  windy: <Wind className="w-6 h-6" />,
}

export function WeatherWidget() {
  const config = weatherConfig[weather.type]
  const extraIcon = weatherIcons[weather.type]

  return (
    <div className="flex items-center gap-5 glass rounded-3xl px-5 py-4 shadow-lg card-interactive overflow-hidden relative">
      
      {/* Weather mascot with colorful background */}
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${config.bgClass} shadow-md relative z-10`}>
        <Mascot type={config.mascot} size="sm" animate={false} />
        {extraIcon && (
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-card flex items-center justify-center shadow-sm text-primary">
            {extraIcon}
          </div>
        )}
      </div>

      {/* Temperature and condition */}
      <div className="flex flex-col relative z-10">
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-extrabold text-foreground">{weather.temp}</span>
          <span className="text-xl text-primary font-bold">°F</span>
        </div>
        <span className="text-sm text-muted-foreground font-bold">{config.label}</span>
        <span className="text-xs text-primary font-medium">{config.funMessage}</span>
      </div>

      <div className="h-14 w-px bg-border/60 relative z-10" />

      {/* High/Low with fun styling */}
      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg icon-bg-coral flex items-center justify-center text-xs font-bold">H</div>
          <span className="text-base font-bold text-foreground">{weather.high}°</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg icon-bg-teal flex items-center justify-center text-xs font-bold">L</div>
          <span className="text-base font-bold text-foreground">{weather.low}°</span>
        </div>
      </div>

      <div className="h-14 w-px bg-border/60 relative z-10" />

      {/* Humidity */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 rounded-xl icon-bg-sky flex items-center justify-center">
          <Droplets className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-foreground">{weather.humidity}%</span>
          <span className="text-xs text-muted-foreground font-medium">Humidity</span>
        </div>
      </div>

      <div className="h-14 w-px bg-border/60 relative z-10" />

      {/* Location */}
      <div className="flex items-center gap-2 relative z-10">
        <div className="w-8 h-8 rounded-lg icon-bg-pink flex items-center justify-center">
          <MapPin className="w-4 h-4" />
        </div>
        <span className="text-sm text-foreground font-semibold">{weather.location}</span>
      </div>
    </div>
  )
}
