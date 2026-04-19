"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OnboardingData } from "../../onboard-wizzard"
import { useNavigate } from "react-router-dom"
import { Rocket, Check, Wifi, Cloud, Smartphone, Server, ArrowLeft, Sparkles, Star, Users, Palette, Sun } from "lucide-react"
import { RainbowArc, FloatingStars, CuteCat } from "@/components/ui/fun-decorations"

type LaunchStepProps = {
  data: OnboardingData
  onBack: () => void
}

type ConnectionStatus = "idle" | "checking" | "success" | "error"

const checkItems = [
  { id: "network", label: "Network Connection", icon: Wifi, delay: 800 },
  { id: "cloud", label: "Cloud Services", icon: Cloud, delay: 1200 },
  { id: "devices", label: "Device Discovery", icon: Smartphone, delay: 1600 },
  { id: "api", label: "API Connection", icon: Server, delay: 2000 },
]

export function LaunchStep({ data, onBack }: LaunchStepProps) {
  const nav = useNavigate()
  const [status, setStatus] = useState<ConnectionStatus>("idle")
  const [checkStatuses, setCheckStatuses] = useState<Record<string, ConnectionStatus>>(
    Object.fromEntries(checkItems.map((item) => [item.id, "idle"]))
  )
  const [launched, setLaunched] = useState(false)

  const runChecks = () => {
    setStatus("checking")
    setCheckStatuses(Object.fromEntries(checkItems.map((item) => [item.id, "idle"])))

    checkItems.forEach((item) => {
      setTimeout(() => {
        setCheckStatuses((prev) => ({ ...prev, [item.id]: "checking" }))
      }, item.delay - 500)

      setTimeout(() => {
        setCheckStatuses((prev) => ({ ...prev, [item.id]: "success" }))
      }, item.delay)
    })

    setTimeout(() => {
      setStatus("success")
    }, 2500)
  }

  useEffect(() => {
    runChecks()
  }, [])

  const handleLaunch = () => {
    setLaunched(true)
    nav("/")
  }

  if (launched) {
    return (
      <div className="text-center space-y-8 py-8 relative">
        {/* Celebration decorations */}
        <FloatingStars className="opacity-50" />
        <RainbowArc className="opacity-60" />
        
        <div className="flex justify-center relative z-10">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[oklch(0.75_0.18_145)] to-[oklch(0.7_0.16_185)] flex items-center justify-center shadow-xl animate-bounce-gentle">
            <Check className="w-14 h-14 text-white" />
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <h1 className="text-4xl font-bold text-foreground text-balance flex items-center justify-center gap-3">
            Hub Launched!
            <Sparkles className="w-8 h-8 text-[oklch(0.9_0.16_95)] animate-sparkle" />
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto text-pretty">
            Your Solora Smart Home Hub is ready. Welcome to your connected family home!
          </p>
        </div>

        <Card className="bg-card border-2 border-border max-w-md mx-auto rounded-3xl shadow-lg relative z-10">
          <CardContent className="p-6">
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-muted-foreground font-medium">Hub Name</span>
                <span className="text-lg font-bold text-foreground">{data.hubName}</span>
              </div>
              {data.hubAlias && (
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground font-medium">Nickname</span>
                  <span className="text-lg font-bold text-foreground">{data.hubAlias}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-muted-foreground font-medium">Family Members</span>
                <span className="text-lg font-bold text-foreground">{data.members.length}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground font-medium">Theme</span>
                <span className="text-lg font-bold text-foreground capitalize">{data.theme}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button 
          size="lg" 
          className="h-16 px-12 rounded-2xl bg-gradient-to-r from-[oklch(0.75_0.2_350)] to-[oklch(0.7_0.18_290)] hover:opacity-90 shadow-xl text-xl font-bold relative z-10"
          onClick={() => nav("/")}
        >
          Go to Dashboard
          <Rocket className="w-6 h-6 ml-3" />
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8 relative">
      {/* Fun decorations */}
      <FloatingStars className="opacity-30" />
      
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[oklch(0.75_0.18_290)] to-[oklch(0.65_0.2_350)] flex items-center justify-center shadow-lg">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            <CuteCat size="sm" className="absolute -right-6 -bottom-2" />
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            Launch Your Hub
            <Star className="w-6 h-6 text-[oklch(0.9_0.16_95)] animate-sparkle" />
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Almost there! Checking all systems before liftoff...
          </p>
        </div>
      </div>

      {/* Connection Checks */}
      <Card className="bg-card border-2 border-border rounded-3xl shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-card to-muted/20 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[oklch(0.75_0.14_185)] to-[oklch(0.65_0.16_185)] flex items-center justify-center">
              <Wifi className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Connection Status</CardTitle>
              <CardDescription className="text-base">Making sure everything is ready</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-3">
          {checkItems.map((item) => {
            const Icon = item.icon
            const itemStatus = checkStatuses[item.id]
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                  itemStatus === "success"
                    ? "bg-[oklch(0.95_0.05_145)] border-[oklch(0.8_0.12_145)]"
                    : itemStatus === "checking"
                      ? "bg-[oklch(0.97_0.03_290)] border-[oklch(0.85_0.08_290)]"
                      : "bg-muted/30 border-border"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      itemStatus === "success"
                        ? "bg-gradient-to-br from-[oklch(0.75_0.16_145)] to-[oklch(0.65_0.14_145)]"
                        : itemStatus === "checking"
                          ? "bg-gradient-to-br from-[oklch(0.75_0.14_290)] to-[oklch(0.65_0.16_290)]"
                          : "bg-muted"
                    }`}
                  >
                    {itemStatus === "success" ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : itemStatus === "checking" ? (
                      <div className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      <Icon className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <span className="font-semibold text-lg text-foreground">{item.label}</span>
                </div>
                <span
                  className={`text-sm font-semibold px-4 py-1.5 rounded-full ${
                    itemStatus === "success"
                      ? "bg-[oklch(0.75_0.16_145)] text-white"
                      : itemStatus === "checking"
                        ? "bg-[oklch(0.75_0.14_290)] text-white"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {itemStatus === "success"
                    ? "Connected!"
                    : itemStatus === "checking"
                      ? "Checking..."
                      : "Waiting"}
                </span>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-gradient-to-br from-[oklch(0.97_0.03_350)] to-card border-2 border-border rounded-3xl shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[oklch(0.75_0.2_350)]" />
            Setup Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-2xl bg-card border-2 border-border">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-[oklch(0.78_0.18_55)] to-[oklch(0.7_0.16_25)] flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-[oklch(0.75_0.18_55)]">1</p>
              <p className="text-xs font-medium text-muted-foreground">Hub</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-card border-2 border-border">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-[oklch(0.75_0.14_290)] to-[oklch(0.65_0.16_260)] flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-[oklch(0.7_0.16_290)]">{data.members.length}</p>
              <p className="text-xs font-medium text-muted-foreground">Members</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-card border-2 border-border">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-[oklch(0.75_0.14_185)] to-[oklch(0.65_0.16_185)] flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-[oklch(0.7_0.14_185)] capitalize">{data.theme.charAt(0).toUpperCase()}</p>
              <p className="text-xs font-medium text-muted-foreground">Theme</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-card border-2 border-border">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-[oklch(0.9_0.14_95)] to-[oklch(0.85_0.12_55)] flex items-center justify-center">
                <Sun className="w-5 h-5 text-[oklch(0.5_0.12_55)]" />
              </div>
              <p className="text-2xl font-bold text-[oklch(0.75_0.14_55)]">{data.brightness}%</p>
              <p className="text-xs font-medium text-muted-foreground">Brightness</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between gap-4 pt-4">
        <Button variant="outline" onClick={onBack} className="h-14 px-6 rounded-2xl bg-transparent border-2 font-semibold">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button 
          onClick={handleLaunch} 
          disabled={status !== "success"}
          className="h-14 px-8 rounded-2xl bg-gradient-to-r from-[oklch(0.75_0.18_290)] to-[oklch(0.65_0.2_350)] hover:opacity-90 shadow-lg font-semibold text-lg disabled:opacity-50"
        >
          {status === "checking" ? (
            <>
              <div className="w-5 h-5 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Checking...
            </>
          ) : (
            <>
              Launch Hub
              <Rocket className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
