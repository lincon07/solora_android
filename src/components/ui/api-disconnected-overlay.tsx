"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useApiHealth } from "@/providers/api-health"
import { AlertTriangle, RefreshCcw, WifiOff } from "lucide-react"

export function ApiDisconnectedOverlay() {
  const { status, lastError, refresh } = useApiHealth()

  if (status !== "down") return null

  return (
    <div className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-sm flex items-center justify-center p-6">
      <Card className="max-w-md w-full border-destructive/40">
        <CardContent className="p-6 space-y-6 text-center">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <WifiOff className="w-10 h-10 text-destructive" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              API Disconnected
            </h1>
            <p className="text-muted-foreground">
              This hub can’t reach the Solora cloud right now.
            </p>
          </div>

          {/* Error detail */}
          {lastError && (
            <div className="rounded-md bg-destructive/5 border border-destructive/20 p-3 text-sm text-destructive flex gap-2 items-start text-left">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{lastError}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={refresh}
              className="gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Retry
            </Button>
          </div>

          {/* Footer */}
          <p className="text-xs text-muted-foreground">
            We’ll automatically reconnect when the service is available.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
