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
} from "lucide-react"

import { useNavigate, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

const navItems = [
  { path: "/", icon: Home, label: "Home", colorClass: "icon-bg-coral" },
  { path: "/calendar", icon: Calendar, label: "Calendar", colorClass: "icon-bg-teal" },
  { path: "/lists", icon: ListChecks, label: "Lists", colorClass: "icon-bg-lavender" },
  { path: "/meals", icon: UtensilsCrossed, label: "Meals", colorClass: "icon-bg-mint" },
]

export function AppSidebar() {
  const nav = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <Sidebar className="w-[70px] border-r border-border/50 bg-sidebar/80 backdrop-blur-sm">
      {/* Logo area */}
      <div className="flex items-center justify-center py-5">
        <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-md">
          <span className="text-primary-foreground font-bold text-lg">S</span>
        </div>
      </div>

      {/* Main navigation */}
      <SidebarContent className="flex flex-col items-center px-2">
        <SidebarMenu className="w-full flex flex-col items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  tooltip={item.label}
                  onClick={() => nav(item.path)}
                  className={cn(
                    "h-12 w-12 flex items-center justify-center rounded-xl transition-all duration-200",
                    active 
                      ? `${item.colorClass} shadow-md scale-105` 
                      : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer with settings */}
      <SidebarFooter className="pb-4 px-2 flex justify-center">
        <SidebarMenu className="w-full flex flex-col items-center gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Settings"
              onClick={() => nav("/settings")}
              className={cn(
                "h-12 w-12 flex items-center justify-center rounded-xl transition-all duration-200",
                isActive("/settings")
                  ? "icon-bg-sunny shadow-md scale-105"
                  : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
              )}
            >
              <Settings className="size-5" strokeWidth={isActive("/settings") ? 2.5 : 2} />
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              className="h-12 w-12 flex items-center justify-center rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
            >
              <LogOut className="size-5" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
