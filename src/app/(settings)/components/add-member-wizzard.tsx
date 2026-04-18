"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Loader2,
  CheckCircle2,
  QrCode,
  UserPlus,
  ArrowRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react"

import { usePairing } from "@/hooks/usePairing"
import { createHubMember, type HubMemberRole } from "@/api/members"
import { Avatar } from "@/components/ui/avatar"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  hubId: string
  onCreated: () => void
}

type Step = "qr" | "claimed" | "profile" | "saving"

export function AddMemberWizard({ open, onOpenChange, hubId, onCreated }: Props) {
  const [step, setStep] = useState<Step>("qr")

  const [claimedUserId, setClaimedUserId] = useState<string | null>(null)
  const [claimError, setClaimError] = useState<string | null>(null)

  const [displayName, setDisplayName] = useState("")
  const [role, setRole] = useState<HubMemberRole>("member")
  const [avatarUrl, setAvatarUrl] = useState<string>("")

  const canNextFromClaimed = Boolean(claimedUserId)
  const canCreate = displayName.trim().length >= 2 && Boolean(claimedUserId)

  const {
    state,
    pairing,
    qr,
    error: pairingError,
    resolvedData,
    start,
    reset,
  } = usePairing({
    type: "member",
    hubId,
    onResolved: (res) => {
      console.log("[v0] Member pairing resolved:", res)

      if (res.status === "expired") {
        setClaimError("Invite expired. Generate a new QR code.")
        setStep("qr")
        return
      }

      if (res.status === "claimed") {
        setClaimError(null)
        setClaimedUserId(res.userId)
        setStep("claimed")
      }
    },
  })

  // When dialog opens, start fresh session
  useEffect(() => {
    if (!open) return

    setStep("qr")
    setClaimedUserId(null)
    setClaimError(null)
    setDisplayName("")
    setRole("member")
    setAvatarUrl("")

    start()

    return () => {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  async function handleNewQr() {
    setClaimedUserId(null)
    setClaimError(null)
    setStep("qr")
    await start()
  }

  async function handleCreate() {
    if (!claimedUserId) return

    setStep("saving")
    try {
      await createHubMember(hubId, {
        userId: claimedUserId,
        displayName: displayName.trim(),
        role,
        avatarUrl: avatarUrl.trim().length > 0 ? avatarUrl.trim() : null,
      })

      onCreated()
      onOpenChange(false)
    } catch (e: any) {
      setStep("profile")
      setClaimError(e?.message ?? "Failed to create member")
    }
  }

  const title = useMemo(() => {
    if (step === "qr") return "Add Family Member"
    if (step === "claimed") return "Account Connected"
    if (step === "profile") return "Set Up Profile"
    return "Creating Member..."
  }, [step])

  const displayError = claimError || pairingError

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <div className="w-8 h-8 rounded-lg icon-bg-lavender flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            {title}
          </DialogTitle>
        </DialogHeader>

        {displayError && (
          <Alert variant="destructive" className="rounded-xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>{displayError}</AlertDescription>
          </Alert>
        )}

        {/* STEP: QR */}
        {step === "qr" && (
          <Card className="border-border rounded-xl">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <QrCode className="w-4 h-4 text-primary" />
                Invite by QR
              </CardTitle>
              <CardDescription>
                Have the user scan this QR code in the phone app to connect their account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {state === "loading" && (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating invite...
                    </span>
                  )}
                  {state === "polling" && (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Waiting for scan...
                    </span>
                  )}
                  {state === "idle" && "Ready"}
                  {state === "error" && "Error occurred"}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNewQr}
                  disabled={state === "loading"}
                  className="rounded-lg"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New QR
                </Button>
              </div>

              <div className="flex justify-center">
                <div className="rounded-2xl border border-border bg-card p-4">
                  {qr ? (
                    <img src={qr} alt="Member invite QR" className="w-56 h-56 rounded-xl" />
                  ) : (
                    <div className="w-56 h-56 rounded-xl flex items-center justify-center text-sm text-muted-foreground bg-muted/30">
                      {state === "loading" ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-8 h-8 animate-spin" />
                          <span>Generating...</span>
                        </div>
                      ) : (
                        "No QR"
                      )}
                    </div>
                  )}
                </div>
              </div>

              {pairing?.pairingCode && state === "polling" && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Manual code</p>
                  <p className="font-mono text-xl font-bold tracking-widest">
                    {pairing.pairingCode}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* STEP: CLAIMED */}
        {step === "claimed" && (
          <Card className="border-border rounded-xl">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Account Connected
              </CardTitle>
              <CardDescription>
                The user approved the invite on their phone. Next we will set up their profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="text-muted-foreground mb-1">Connected account</div>
                <div className="font-mono break-all text-foreground">{claimedUserId}</div>
              </div>
              <div className="text-xs text-muted-foreground">
                Membership is created on the hub after you confirm profile details.
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP: PROFILE */}
        {step === "profile" && (
          <div className="space-y-5">
            {/* Avatar Preview */}
            <div className="flex justify-center">
              <Avatar
                name={displayName || "New Member"}
                identifier={claimedUserId || "new"}
                size="xl"
              />
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-3 text-sm">
              <div className="text-muted-foreground mb-1">Connected userId</div>
              <div className="font-mono break-all text-foreground">
                {claimedUserId?.slice(0, 20)}...
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Display name</Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Sarah Johnson"
                className="h-12 text-base bg-input border-border rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as HubMemberRole)}>
                <SelectTrigger className="h-12 text-base bg-input border-border rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border rounded-xl">
                  <SelectItem value="member" className="h-11 rounded-lg">Member</SelectItem>
                  <SelectItem value="admin" className="h-11 rounded-lg">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Avatar URL (optional)</Label>
              <Input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="h-12 text-base bg-input border-border rounded-xl"
              />
            </div>

            {!claimedUserId && (
              <Alert variant="destructive" className="rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Not connected</AlertTitle>
                <AlertDescription>Go back and scan the QR code first.</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* STEP: SAVING */}
        {step === "saving" && (
          <div className="py-10 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-2xl icon-bg-mint flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              Creating member profile...
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          {/* Left side */}
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-12 rounded-xl"
            disabled={step === "saving"}
          >
            Close
          </Button>

          {/* Right side actions */}
          {step === "qr" && (
            <Button
              onClick={handleNewQr}
              className="h-12 rounded-xl"
              disabled={state === "loading"}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              New QR
            </Button>
          )}

          {step === "claimed" && (
            <>
              <Button
                variant="outline"
                onClick={handleNewQr}
                className="h-12 rounded-xl"
              >
                New QR
              </Button>
              <Button
                onClick={() => setStep("profile")}
                className="h-12 rounded-xl"
                disabled={!canNextFromClaimed}
              >
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}

          {step === "profile" && (
            <Button
              onClick={handleCreate}
              className="h-12 rounded-xl"
              disabled={!canCreate}
            >
              Create Member
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
