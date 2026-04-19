"use client"

import { useLocation } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/ui/sidebar/app-sidebar"
import { Toaster } from "./components/ui/sonner"
import { PairingProvider } from "./providers/pairing"

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const hideSidebar = location.pathname.startsWith("/onboard-wizzard")

  // 🚫 Onboarding (NO sidebar) - Fun background for kids
  if (hideSidebar) {
    return (
      <main className="min-h-screen w-full flex flex-col overflow-hidden bg-pattern-stars bg-pattern-rainbow">
        <PairingProvider>{children}</PairingProvider>
        <Toaster />
      </main>
    )
  }

  // ✅ App layout
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "50px",
          "--sidebar-width-mobile": "50px",
        } as React.CSSProperties
      }
    >
      <div className="flex min-h-screen w-full overflow-hidden p-10">
        <AppSidebar />

        {/* ✅ Layout owns size + overflow */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <PairingProvider>{children}</PairingProvider>
          <Toaster />
        </main>
      </div>
    </SidebarProvider>
  )
}
