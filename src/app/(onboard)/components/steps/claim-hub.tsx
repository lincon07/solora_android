"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { OnboardingData } from "../../onboard-wizzard"
import { soloras } from "@/lib/tauri"
import { Loader2, CheckCircle2, RefreshCw, QrCode, AlertCircle, Sparkles } from "lucide-react"
import { usePairing } from "@/hooks/usePairing"

type ClaimHubStepProps = {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

export function ClaimHubStep({
  data,
  updateData,
  onNext,
  onBack,
}: ClaimHubStepProps) {
  const [claimedByUserId, setClaimedByUserId] = useState<string | null>(null)
  const [tokenStored, setTokenStored] = useState(false)

  const {
    state,
    pairing,
    qr,
    status,
    error,
    resolvedData,
    start,
    reset,
  } = usePairing({
    type: "hub",
    autoStart: true,
    onResolved: async (res) => {
      console.log("[v0] Hub pairing resolved:", res)

      if (res.hubId) {
        updateData({ claimedHubId: res.hubId })
      }

      if (res.userId) {
        setClaimedByUserId(res.userId)
      }

      if (res.deviceToken) {
        try {
          await soloras.setDeviceToken(res.deviceToken)
          setTokenStored(true)
          console.log("[v0] Device token stored successfully")
        } catch (err) {
          console.error("[v0] Failed to store device token:", err)
        }
      }
    },
  })

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isClaimed = Boolean(data.claimedHubId)
  const isPaired = resolvedData?.status === "paired"
  const isExpired = resolvedData?.status === "expired"
  const canContinue = isClaimed && isPaired && tokenStored

  const handleNewQr = async () => {
    setClaimedByUserId(null)
    setTokenStored(false)
    updateData({ claimedHubId: null, pairingId: null })
    await start()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl icon-bg-coral flex items-center justify-center">
            <QrCode className="w-8 h-8" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Claim Your Hub</h1>
          <p className="text-muted-foreground">
            Scan the QR code with your phone to securely link this hub to your account.
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {(error || isExpired) && (
        <Alert variant="destructive" className="rounded-xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {isExpired ? "Session Expired" : "Connection Error"}
          </AlertTitle>
          <AlertDescription>
            {isExpired
              ? "The pairing session has expired. Please generate a new QR code."
              : error}
          </AlertDescription>
        </Alert>
      )}

      {/* Pairing Card */}
      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Hub Pairing
          </CardTitle>
          <CardDescription>
            This connects your user account to this physical hub device.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Status Row */}
          <div className="flex items-center justify-between">
            <div className="text-sm flex items-center gap-2 text-muted-foreground">
              {state === "loading" && (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating session...
                </>
              )}
              {state === "polling" && (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Waiting for scan...
                </>
              )}
              {state === "resolved" && isPaired && (
                <>
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Hub claimed successfully
                </>
              )}
              {state === "resolved" && isExpired && (
                <>
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  Session expired
                </>
              )}
              {state === "error" && (
                <>
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  Error occurred
                </>
              )}
              {state === "idle" && "Ready to start"}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              disabled={state === "loading"}
              onClick={handleNewQr}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              New QR
            </Button>
          </div>

          {/* QR Code Display */}
          <div className="flex justify-center">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              {qr ? (
                <img
                  src={qr}
                  alt="Pairing QR Code"
                  className="w-56 h-56 rounded-xl"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-sm text-muted-foreground rounded-xl bg-muted/30">
                  {state === "loading" ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <span>Generating...</span>
                    </div>
                  ) : (
                    "No QR code"
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Pairing Code Display */}
          {pairing?.pairingCode && state === "polling" && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Manual code</p>
              <p className="font-mono text-2xl font-bold tracking-widest text-foreground">
                {pairing.pairingCode}
              </p>
            </div>
          )}

          {/* Success Info */}
          {isClaimed && isPaired && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Hub Successfully Claimed</span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hub ID</span>
                  <span className="font-mono text-foreground">{data.claimedHubId}</span>
                </div>

                {claimedByUserId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Owner</span>
                    <span className="font-mono text-foreground">
                      {claimedByUserId.slice(0, 8)}...
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Token stored</span>
                  <span className={tokenStored ? "text-primary" : "text-muted-foreground"}>
                    {tokenStored ? "Yes" : "Pending..."}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Ownership and permissions have been automatically assigned.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="rounded-xl h-12 px-6">
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!canContinue}
          className="rounded-xl h-12 px-6"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
