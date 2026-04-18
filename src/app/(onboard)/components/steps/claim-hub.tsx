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
import { Loader2, CheckCircle2, RefreshCw, QrCode, AlertCircle, Sparkles, PartyPopper } from "lucide-react"
import { usePairing } from "@/hooks/usePairing"
import { Mascot, FloatingShapes } from "@/components/ui/mascot"

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
    <div className="space-y-6 relative">
      {/* Floating decorations */}
      <FloatingShapes className="opacity-30" />

      {/* Header with mascot */}
      <div className="text-center space-y-4 relative z-10">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl icon-bg-pink flex items-center justify-center shadow-xl">
              <QrCode className="w-10 h-10" />
            </div>
            <div className="absolute -top-3 -right-3">
              <Mascot type="star" size="sm" mood="excited" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Connect Your <span className="text-rainbow">Home!</span>
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            Ask a grown-up to scan this magic code with their phone!
          </p>
        </div>
      </div>

      {/* Error Alert - Kid friendly */}
      {(error || isExpired) && (
        <Alert variant="destructive" className="rounded-2xl border-2 relative z-10">
          <div className="flex items-center gap-3">
            <Mascot type="cloud" size="sm" mood="sleepy" animate={false} />
            <div>
              <AlertTitle className="font-bold">
                {isExpired ? "Oops! Time ran out" : "Something went wrong"}
              </AlertTitle>
              <AlertDescription>
                {isExpired
                  ? "No worries! Just tap the button to get a new magic code."
                  : error}
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}

      {/* Pairing Card - Playful style */}
      <Card className="rounded-3xl border-2 border-border shadow-xl bg-card/90 backdrop-blur-sm relative z-10">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl icon-bg-purple flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            Magic Connection Code
          </CardTitle>
          <CardDescription className="text-base">
            This special code connects your family&apos;s phones to your home!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Status Row - Fun messages */}
          <div className="flex items-center justify-between">
            <div className="text-sm flex items-center gap-2 text-muted-foreground font-medium">
              {state === "loading" && (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  Creating magic code...
                </>
              )}
              {state === "polling" && (
                <>
                  <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
                  Waiting for a scan...
                </>
              )}
              {state === "resolved" && isPaired && (
                <>
                  <PartyPopper className="w-5 h-5 text-primary" />
                  <span className="text-primary font-bold">Yay! Connected!</span>
                </>
              )}
              {state === "resolved" && isExpired && (
                <>
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  Code expired
                </>
              )}
              {state === "error" && (
                <>
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  Oops! Try again
                </>
              )}
              {state === "idle" && "Ready to connect!"}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="rounded-xl btn-bubble"
              disabled={state === "loading"}
              onClick={handleNewQr}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              New Code
            </Button>
          </div>

          {/* QR Code Display - Colorful frame */}
          <div className="flex justify-center">
            <div className="rounded-3xl border-4 border-primary/30 bg-card p-3 shadow-lg relative">
              {/* Decorative corners */}
              <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-primary" />
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-secondary" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-accent" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-[oklch(0.7500_0.1800_145)]" />
              
              {qr ? (
                <img
                  src={qr}
                  alt="Pairing QR Code"
                  className="w-64 h-64 rounded-2xl"
                />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center text-sm text-muted-foreground rounded-2xl bg-muted/30">
                  {state === "loading" ? (
                    <div className="flex flex-col items-center gap-3">
                      <Mascot type="sunny" size="md" mood="excited" />
                      <span className="font-medium">Creating magic...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Mascot type="cloud" size="md" mood="thinking" />
                      <span>No code yet</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Pairing Code Display - Big and colorful */}
          {pairing?.pairingCode && state === "polling" && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2 font-medium">Or type this secret code:</p>
              <div className="inline-block bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl px-6 py-3">
                <p className="font-mono text-4xl font-extrabold tracking-widest text-foreground">
                  {pairing.pairingCode}
                </p>
              </div>
            </div>
          )}

          {/* Success Info - Celebration style */}
          {isClaimed && isPaired && (
            <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl icon-bg-green flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-bold text-lg text-foreground">Awesome! You&apos;re Connected!</span>
                  <p className="text-sm text-muted-foreground">Your smart home is ready to go!</p>
                </div>
                <Mascot type="heart" size="sm" mood="happy" />
              </div>

              <div className="space-y-2 text-sm bg-card/50 rounded-xl p-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Home ID</span>
                  <span className="font-mono text-foreground font-bold">{data.claimedHubId?.slice(0, 12)}...</span>
                </div>

                {claimedByUserId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Owner</span>
                    <span className="font-mono text-foreground font-bold">
                      {claimedByUserId.slice(0, 8)}...
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Ready to use</span>
                  <span className={tokenStored ? "text-primary font-bold flex items-center gap-1" : "text-muted-foreground"}>
                    {tokenStored ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Yes!
                      </>
                    ) : (
                      "Almost there..."
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation - Playful buttons */}
      <div className="flex justify-between relative z-10">
        <Button variant="outline" onClick={onBack} className="rounded-2xl h-14 px-8 text-lg font-bold btn-bubble border-2">
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!canContinue}
          className="rounded-2xl h-14 px-8 text-lg font-bold btn-bubble bg-gradient-to-r from-primary to-accent border-0"
        >
          {canContinue ? "Let's Go!" : "Waiting..."}
          {canContinue && <PartyPopper className="w-5 h-5 ml-2" />}
        </Button>
      </div>
    </div>
  )
}
