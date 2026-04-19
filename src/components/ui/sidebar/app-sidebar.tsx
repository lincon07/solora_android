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
  { path: "/", icon: Home, label: "Home" },
  { path: "/calendar", icon: Calendar, label: "Calendar" },
  { path: "/lists", icon: ListChecks, label: "Lists" },
  { path: "/meals", icon: UtensilsCrossed, label: "Meals" },
]

export function AppSidebar() {
  const nav = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <Sidebar className="w-[80px] border-r-0 bg-sidebar">
      {/* Logo area */}
      <div className="flex items-center justify-center py-6">
        <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow">
          <Sparkles className="w-6 h-6 text-primary-foreground" />
        </div>
      </div>

      {/* Main navigation */}
      <SidebarContent className="flex flex-col items-center px-3 mt-2">
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
                    "h-12 w-12 flex items-center justify-center rounded-lg transition-all",
                    active 
                      ? "bg-primary text-primary-foreground shadow" 
                      : "bg-sidebar-accent text-sidebar-foreground/70 hover:bg-sidebar-primary"
                  )}
                >
                  <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="pb-4 px-3 flex justify-center">
        <SidebarMenu className="w-full flex flex-col items-center gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Settings"
              onClick={() => nav("/settings")}
              className={cn(
                "h-12 w-12 flex items-center justify-center rounded-lg transition-all",
                isActive("/settings")
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-sidebar-accent text-sidebar-foreground/70 hover:bg-sidebar-primary"
              )}
            >
              <Settings className="size-5" strokeWidth={isActive("/settings") ? 2.5 : 2} />
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              className="h-12 w-12 flex items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-destructive transition-all"
            >
              <LogOut className="size-5" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
