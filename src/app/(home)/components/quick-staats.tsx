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
    { label: "Tasks Done", value: String(props.done), total: String(props.total), icon: CheckCircle2 },
    { label: "Pending", value: String(props.pending), icon: Circle },
    { label: "Members Active", value: String(props.activeMembers), icon: Users },
    { label: "Avg. Time", value: props.avgHours ? `${props.avgHours.toFixed(1)}h` : "—", icon: Clock },
  ]

  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card border border-border rounded-xl p-3 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold text-foreground">{stat.value}</span>
            {stat.total && <span className="text-sm text-muted-foreground">/{stat.total}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
