"use client"

import { useLocation } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/ui/sidebar/app-sidebar"
import { Toaster } from "./components/ui/sonner"
import { PairingProvider } from "./providers/pairing"

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const hideSidebar = location.pathname.startsWith("/onboard-wizzard")

  // Onboarding — full background, no sidebar
  if (hideSidebar) {
    return (
      <main className="min-h-screen w-full flex flex-col overflow-hidden">
        <PairingProvider>{children}</PairingProvider>
        <Toaster />
      </main>
    )
  }

  // App layout — nature bg shows through, panels use glass
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "50px",
          "--sidebar-width-mobile": "50px",
        } as React.CSSProperties
      }
    >
      <div className="flex min-h-screen w-full overflow-hidden p-6 gap-4">
        <AppSidebar />

        {/* Main content area — glass panel over the nature background */}
        <main className="flex-1 flex flex-col overflow-hidden rounded-3xl glass shadow-xl">
          <PairingProvider>{children}</PairingProvider>
          <Toaster />
        </main>
      </div>
    </SidebarProvider>
  )
}
