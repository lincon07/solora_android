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
  Users,
  Settings,
  LogOut,
  FolderOpenDot,
  ListStart,
  ListChecks,
  ForkKnifeIcon,
} from "lucide-react"

import { useNavigate, useLocation } from "react-router-dom"
import clsx from "clsx"

export function AppSidebar() {
  const nav = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const baseBtn =
    "h-14 w-14 flex items-center justify-center rounded-xl"

  return (
    <Sidebar className="w-[50px] border-r">
      {/* ---------- Main Icons ---------- */}
      <SidebarContent className="flex flex-col items-center  pt-4">
        <SidebarMenu className="w-full flex flex-col items-center gap-3">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Home"
              onClick={() => nav("/")}
              className={clsx(baseBtn, isActive("/") && "bg-muted")}
            >
              <Home className="size-7" />
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Calendar"
              onClick={() => nav("/calendar")}
              className={clsx(baseBtn, isActive("/calendar") && "bg-muted")}
            >
              <Calendar className="size-7" />
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Lists"
              onClick={() => nav("/lists")}
              className={clsx(baseBtn, isActive("/lists") && "bg-muted")}
            >
              <ListChecks className="size-7" />
            </SidebarMenuButton>
          </SidebarMenuItem>

           <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Meal Planner"
              onClick={() => nav("/meals")}
              className={clsx(baseBtn, isActive("/meals") && "bg-muted")}
            >
              <ForkKnifeIcon className="size-7" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      {/* ---------- Footer Icons ---------- */}
      <SidebarFooter className="pb-4 flex justify-center">
        <SidebarMenu className="w-full flex flex-col items-center gap-3">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Settings"
              onClick={() => nav("/settings")}
              className={baseBtn}
            >
              <Settings className="size-7" />
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              className={clsx(baseBtn, "text-destructive")}
            >
              <LogOut className="size-7" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
