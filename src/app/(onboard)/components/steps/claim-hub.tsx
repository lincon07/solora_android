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
import type { OnboardingData } from "../../onboard-wizzard"
import { soloras } from "@/lib/tauri"
import { Loader2, CheckCircle2 } from "lucide-react"
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
  const [claiming, setClaiming] = useState(true)

  const {  qr, loading, start, reset } = usePairing({
    type: "hub",
    onResolved: (res) => {
      setClaiming(false)

      if (res?.hubId) {
        updateData({ claimedHubId: res.hubId })
      }

      if (res?.userId) {
        setClaimedByUserId(res.userId)
      }

      if (res?.deviceToken) {
        soloras.setDeviceToken(res.deviceToken)
        console.log("✅ Device token stored:", res.deviceToken)
      }
    },
  })

  /* -------------------------------------------------------
   * Start pairing on mount
   * ----------------------------------------------------- */
  useEffect(() => {
    let mounted = true

    ;(async () => {
      if (!mounted) return
      setClaiming(true)
      await start()
    })()

    return () => {
      mounted = false
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isClaimed = Boolean(data.claimedHubId)
  const canContinue = isClaimed && !claiming

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">
          Claim this Hub
        </h1>
        <p className="text-muted-foreground">
          Scan the QR code with your phone to securely link this hub.
        </p>
      </div>

      {/* Pairing Card */}
      <Card>
        <CardHeader>
          <CardTitle>Hub Pairing</CardTitle>
          <CardDescription>
            This connects a user account to this physical hub.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="text-sm flex items-center gap-2 text-muted-foreground">
              {loading || claiming ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Waiting for claim…
                </>
              ) : isClaimed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Hub claimed
                </>
              ) : (
                "Ready"
              )}
            </div>

            <Button
              variant="outline"
              disabled={loading}
              onClick={async () => {
                setClaiming(true)
                setClaimedByUserId(null)
                updateData({ claimedHubId: null, pairingId: null })
                await start()
              }}
            >
              New QR
            </Button>
          </div>

          {/* QR */}
          <div className="flex justify-center">
            <div className="rounded-xl border bg-secondary/20 p-4">
              {qr ? (
                <img
                  src={qr}
                  alt="Pairing QR"
                  className="w-56 h-56 rounded-lg"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-sm text-muted-foreground">
                  {loading ? "Generating…" : "No QR"}
                </div>
              )}
            </div>
          </div>

          {/* Claimed Info */}
          {isClaimed && (
            <div className="rounded-lg border bg-secondary/30 p-4 text-sm space-y-2">
              <div>
                <strong>Hub ID:</strong>{" "}
                <span className="font-mono">{data.claimedHubId}</span>
              </div>

              {claimedByUserId && (
                <div>
                  <strong>Claimed by account:</strong>{" "}
                  <span className="font-mono">{claimedByUserId}</span>
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                Ownership and permissions are automatically assigned.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!canContinue}>
          Continue
        </Button>
      </div>
    </div>
  )
}
