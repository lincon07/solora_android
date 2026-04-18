"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle2, QrCode, UserPlus, ArrowRight } from "lucide-react"

import { usePairing } from "@/hooks/usePairing"
import { createHubMember, type HubMemberRole } from "@/api/members"

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

  const { pairing, qr, loading, start, reset } = usePairing({
    type: "member",
    hubId,
    onResolved: (res) => {
      if (res.status === "expired") {
        setClaimError("Invite expired. Generate a new QR code.")
        setStep("qr")
        return
      }

      if (res.status === "claimed") {
        setClaimError(null)
        setClaimedUserId((res.userId ?? null) as any)
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

    ;(async () => {
      await start()
    })()

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
    if (step === "qr") return "Add Member"
    if (step === "claimed") return "Account Connected"
    if (step === "profile") return "Set Up Profile"
    return "Creating Member…"
  }, [step])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        {claimError && (
          <Alert variant="destructive">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>{claimError}</AlertDescription>
          </Alert>
        )}

        {/* STEP: QR */}
        {step === "qr" && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <QrCode className="w-4 h-4" />
                Invite by QR
              </CardTitle>
              <CardDescription>
                Have the user scan this QR code in the phone app to connect their account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Creating invite…
                    </span>
                  ) : pairing ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Waiting for scan…
                    </span>
                  ) : (
                    "Not started"
                  )}
                </span>

                <Button variant="outline" onClick={handleNewQr} disabled={loading}>
                  New QR
                </Button>
              </div>

              <div className="flex justify-center">
                <div className="rounded-xl border border-border bg-secondary/20 p-4">
                  {qr ? (
                    <img src={qr} alt="Member invite QR" className="w-56 h-56 rounded-lg" />
                  ) : (
                    <div className="w-56 h-56 rounded-lg flex items-center justify-center text-sm text-muted-foreground">
                      {loading ? "Generating…" : "No QR"}
                    </div>
                  )}
                </div>
              </div>

              {pairing?.pairingCode && (
                <div className="text-xs text-muted-foreground text-center">
                  Code: <span className="font-mono">{pairing.pairingCode}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* STEP: CLAIMED */}
        {step === "claimed" && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Account connected
              </CardTitle>
              <CardDescription>
                The user approved the invite on their phone. Next we’ll set up their profile on this hub.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-lg border border-border bg-secondary/20 p-3">
                <div className="text-muted-foreground">Connected account (userId)</div>
                <div className="font-mono break-all">{claimedUserId}</div>
              </div>
              <div className="text-xs text-muted-foreground">
                Membership is created on the hub after you confirm profile details.
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP: PROFILE */}
        {step === "profile" && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-secondary/20 p-3 text-sm">
              <div className="text-muted-foreground">Connected userId</div>
              <div className="font-mono break-all">{claimedUserId}</div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Display name</Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Sarah Johnson"
                className="h-12 text-base bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as HubMemberRole)}>
                <SelectTrigger className="h-12 text-base bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="member" className="h-11">Member</SelectItem>
                  <SelectItem value="admin" className="h-11">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Avatar URL (optional)</Label>
              <Input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://…"
                className="h-12 text-base bg-input border-border"
              />
            </div>

            {!claimedUserId && (
              <Alert variant="destructive">
                <AlertTitle>Not connected</AlertTitle>
                <AlertDescription>Go back and scan the QR code first.</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* STEP: SAVING */}
        {step === "saving" && (
          <div className="py-10 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin" />
            <div className="text-sm text-muted-foreground">Creating member profile…</div>
          </div>
        )}

        <DialogFooter className="gap-2">
          {/* Left side */}
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-12"
            disabled={step === "saving"}
          >
            Close
          </Button>

          {/* Right side actions */}
          {step === "qr" && (
            <Button onClick={handleNewQr} className="h-12" disabled={loading}>
              New QR
            </Button>
          )}

          {step === "claimed" && (
            <>
              <Button variant="outline" onClick={handleNewQr} className="h-12">
                New QR
              </Button>
              <Button
                onClick={() => setStep("profile")}
                className="h-12"
                disabled={!canNextFromClaimed}
              >
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}

          {step === "profile" && (
            <Button onClick={handleCreate} className="h-12" disabled={!canCreate}>
              Create Member
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
