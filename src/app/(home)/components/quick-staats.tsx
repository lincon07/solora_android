"use client"

import { CheckCircle2, Circle, Clock, Users, Star, Trophy, Sparkles, Heart } from "lucide-react"

export function QuickStats(props: {
  done: number
  total: number
  pending: number
  activeMembers: number
  avgHours: number
}) {
  const stats = [
    { 
      label: "Tasks Done", 
      value: String(props.done), 
      total: String(props.total), 
      icon: Trophy,
      colorClass: "icon-bg-green",
      bgGradient: "from-[oklch(0.9200_0.1000_145)] to-[oklch(0.8800_0.1200_155)]",
      funLabel: "Great job!"
    },
    { 
      label: "To Do", 
      value: String(props.pending), 
      icon: Star,
      colorClass: "icon-bg-sunny",
      bgGradient: "from-[oklch(0.9400_0.1200_95)] to-[oklch(0.9000_0.1400_85)]",
      funLabel: "You got this!"
    },
    { 
      label: "Family Online", 
      value: String(props.activeMembers), 
      icon: Heart,
      colorClass: "icon-bg-pink",
      bgGradient: "from-[oklch(0.9200_0.1000_350)] to-[oklch(0.8800_0.1200_340)]",
      funLabel: "Together!"
    },
    { 
      label: "Avg. Time", 
      value: props.avgHours ? `${props.avgHours.toFixed(1)}h` : "—", 
      icon: Sparkles,
      colorClass: "icon-bg-purple",
      bgGradient: "from-[oklch(0.9200_0.1000_290)] to-[oklch(0.8800_0.1200_280)]",
      funLabel: "Amazing!"
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={stat.label} 
          className="bg-card border-2 border-border rounded-3xl p-5 flex flex-col shadow-lg card-interactive overflow-hidden relative group"
        >
          {/* Decorative background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-30 group-hover:opacity-50 transition-opacity`} />
          
          {/* Decorative corner shape */}
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-primary/10 pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.colorClass} shadow-md`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-muted-foreground">{stat.label}</span>
              <span className="text-xs text-primary font-semibold">{stat.funLabel}</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1 relative z-10">
            <span className="text-4xl font-extrabold text-foreground">{stat.value}</span>
            {stat.total && <span className="text-xl text-muted-foreground font-bold">/{stat.total}</span>}
          </div>
          
          {/* Progress indicator for tasks done */}
          {stat.total && (
            <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden relative z-10">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${(parseInt(stat.value) / parseInt(stat.total)) * 100}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
