"use client"

import { Button } from "@/components/ui/button"
import { useApiHealth } from "@/providers/api-health"
import { RefreshCcw, WifiOff, CloudOff } from "lucide-react"
import { CuteCat } from "@/components/ui/fun-decorations"

export function ApiDisconnectedOverlay() {
  const { status, lastError, refresh } = useApiHealth()

  if (status !== "down") return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
      {/* Background with blur */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-md" />
      
      {/* Content card */}
      <div className="relative glass rounded-3xl max-w-sm w-full p-8 shadow-2xl">
        {/* Mascot */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center">
              <CloudOff className="w-12 h-12 text-destructive" />
            </div>
            <CuteCat size="sm" className="absolute -right-4 -bottom-2" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Connection Lost
          </h1>
          <p className="text-muted-foreground">
            We can&apos;t reach the Solora cloud right now. Don&apos;t worry, we&apos;ll keep trying!
          </p>
        </div>

        {/* Error detail */}
        {lastError && (
          <div className="mb-6 rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive flex gap-3 items-start">
            <WifiOff className="w-5 h-5 mt-0.5 shrink-0" />
            <span className="leading-relaxed">{lastError}</span>
          </div>
        )}

        {/* Action */}
        <Button
          onClick={refresh}
          className="w-full h-12 rounded-xl font-semibold gap-2"
        >
          <RefreshCcw className="w-5 h-5" />
          Try Again
        </Button>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          We&apos;ll automatically reconnect when possible
        </p>
      </div>
    </div>
  )
}
