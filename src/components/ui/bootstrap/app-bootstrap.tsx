"use client"

import { useApiHealth } from "@/providers/api-health"
import { Loader2 } from "lucide-react"

export function AppBootstrap({ children }: { children: React.ReactNode }) {
  const { initialized } = useApiHealth()

  if (!initialized) {
    return (
      <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Starting Solora…
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
