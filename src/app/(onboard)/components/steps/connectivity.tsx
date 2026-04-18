"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import type { OnboardingData } from "../../onboard-wizzard"
import { useApiHealth } from "@/providers/api-health"

type Props = {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

type ItemStatus = "idle" | "checking" | "ok" | "fail"

export function ConnectivityStep({ onNext, onBack }: Props) {
  const { status: apiStatus, lastError, refresh } = useApiHealth()

  const [network, setNetwork] = useState<ItemStatus>("idle")
  const [api, setApi] = useState<ItemStatus>("idle")

  const [running, setRunning] = useState(false)

  const canContinue = useMemo(() => network === "ok" && api === "ok", [network, api])

  async function run() {
    setRunning(true)

    // Network check
    setNetwork("checking")
    const online = typeof navigator !== "undefined" ? navigator.onLine : true
    setNetwork(online ? "ok" : "fail")

    // API check
    setApi("checking")
    await refresh()
    setApi(apiStatus === "ok" ? "ok" : "fail")

    setRunning(false)
  }

  useEffect(() => {
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // keep API status reflected if it flips while on screen
  useEffect(() => {
    if (apiStatus === "ok") setApi("ok")
    if (apiStatus === "down") setApi("fail")
  }, [apiStatus])

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Connectivity Check</h1>
        <p className="text-muted-foreground">
          We need a working API connection before showing the pairing QR code.
        </p>
      </div>

      {apiStatus === "down" && (
        <Alert variant="destructive">
          <AlertTitle>API Offline</AlertTitle>
          <AlertDescription>
            {lastError ?? "The hub can’t reach the API right now. Check Wi-Fi or the server."}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">System Checks</CardTitle>
          <CardDescription>These must pass before pairing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Row label="Network Connection" status={network} />
          <Row label="API /health" status={api} />
        </CardContent>
      </Card>

      <div className="flex justify-between gap-3">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={run} disabled={running}>
            {running ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Checking…
              </>
            ) : (
              "Retry"
            )}
          </Button>

          <Button onClick={onNext} disabled={!canContinue}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}

function Row({ label, status }: { label: string; status: ItemStatus }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <div className="flex items-center gap-2">
        {status === "checking" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : status === "ok" ? (
          <CheckCircle2 className="w-4 h-4 text-primary" />
        ) : status === "fail" ? (
          <XCircle className="w-4 h-4 text-destructive" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-muted-foreground" />
        )}
        <span>{label}</span>
      </div>
      <span className="text-sm text-muted-foreground">
        {status === "ok" ? "OK" : status === "fail" ? "Failed" : status === "checking" ? "Checking…" : "Pending"}
      </span>
    </div>
  )
}
