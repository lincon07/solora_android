"use client"

import { CheckCircle2, Circle, Clock, Users } from "lucide-react"

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
      icon: CheckCircle2,
      colorClass: "icon-bg-mint"
    },
    { 
      label: "Pending", 
      value: String(props.pending), 
      icon: Circle,
      colorClass: "icon-bg-sunny"
    },
    { 
      label: "Members Active", 
      value: String(props.activeMembers), 
      icon: Users,
      colorClass: "icon-bg-lavender"
    },
    { 
      label: "Avg. Time", 
      value: props.avgHours ? `${props.avgHours.toFixed(1)}h` : "—", 
      icon: Clock,
      colorClass: "icon-bg-teal"
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div 
          key={stat.label} 
          className="bg-card border border-border rounded-2xl p-4 flex flex-col shadow-sm card-interactive"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.colorClass}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground">{stat.value}</span>
            {stat.total && <span className="text-lg text-muted-foreground font-medium">/{stat.total}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
