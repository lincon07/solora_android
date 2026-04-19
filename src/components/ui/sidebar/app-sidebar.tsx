"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

import {
  Home,
  Calendar,
  Settings,
  LogOut,
  ListChecks,
  UtensilsCrossed,
  Sparkles,
} from "lucide-react"

import { useNavigate, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

const navItems = [
  { path: "/", icon: Home, label: "Home", colorClass: "icon-bg-pink", hoverBg: "hover:bg-[oklch(0.9000_0.1200_350)]" },
  { path: "/calendar", icon: Calendar, label: "Calendar", colorClass: "icon-bg-teal", hoverBg: "hover:bg-[oklch(0.9000_0.1000_185)]" },
  { path: "/lists", icon: ListChecks, label: "Lists", colorClass: "icon-bg-purple", hoverBg: "hover:bg-[oklch(0.9000_0.1000_290)]" },
  { path: "/meals", icon: UtensilsCrossed, label: "Meals", colorClass: "icon-bg-green", hoverBg: "hover:bg-[oklch(0.9000_0.1000_145)]" },
]

export function AppSidebar() {
  const nav = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <Sidebar className="w-[80px] border-r-0 rounded-3xl shadow-2xl glass-heavy overflow-hidden">
      {/* Fun logo area with mascot-style icon */}
      <div className="flex items-center justify-center py-6">
        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center shadow-lg animate-bounce-gentle relative">
          <Sparkles className="w-7 h-7 text-secondary-foreground" />
          {/* Decorative sparkle */}
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary animate-sparkle" />
        </div>
      </div>

      {/* Main navigation with colorful buttons */}
      <SidebarContent className="flex flex-col items-center px-3 mt-2">
        <SidebarMenu className="w-full flex flex-col items-center gap-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  tooltip={item.label}
                  onClick={() => nav(item.path)}
                  className={cn(
                    "h-14 w-14 flex items-center justify-center rounded-2xl transition-all duration-300",
                    "btn-bubble",
                    active 
                      ? `${item.colorClass} shadow-lg scale-110` 
                      : `bg-sidebar-accent/50 text-sidebar-foreground/70 ${item.hoverBg}`
                  )}
                >
                  <Icon className={cn("size-6", active && "animate-wiggle")} strokeWidth={active ? 2.5 : 2} />
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Fun footer with settings */}
      <SidebarFooter className="pb-6 px-3 flex justify-center">
        <SidebarMenu className="w-full flex flex-col items-center gap-3">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Settings"
              onClick={() => nav("/settings")}
              className={cn(
                "h-14 w-14 flex items-center justify-center rounded-2xl transition-all duration-300 btn-bubble",
                isActive("/settings")
                  ? "icon-bg-sunny shadow-lg scale-110"
                  : "bg-sidebar-accent/50 text-sidebar-foreground/70 hover:bg-[oklch(0.9200_0.1200_95)]"
              )}
            >
              <Settings className={cn("size-6", isActive("/settings") && "animate-spin")} style={{ animationDuration: '3s' }} strokeWidth={isActive("/settings") ? 2.5 : 2} />
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              className="h-14 w-14 flex items-center justify-center rounded-2xl bg-sidebar-accent/30 text-sidebar-foreground/60 hover:bg-destructive/20 hover:text-destructive transition-all duration-300 btn-bubble"
            >
              <LogOut className="size-5" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden">
        <svg viewBox="0 0 80 32" className="w-full h-full" preserveAspectRatio="none">
          <path 
            d="M0,32 L0,20 Q20,10 40,20 Q60,30 80,20 L80,32 Z" 
            fill="oklch(0.6500 0.1600 280 / 0.3)"
          />
        </svg>
      </div>
    </Sidebar>
  )
}
