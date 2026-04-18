"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OnboardingData } from "../../onboard-wizzard"
import { useNavigate } from "react-router-dom"

type LaunchStepProps = {
  data: OnboardingData
  onBack: () => void
}

type ConnectionStatus = "idle" | "checking" | "success" | "error"

const checkItems = [
  { id: "network", label: "Network Connection", delay: 800 },
  { id: "cloud", label: "Cloud Services", delay: 1200 },
  { id: "devices", label: "Device Discovery", delay: 1600 },
  { id: "api", label: "API Connection", delay: 2000 },
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
      <div className="text-center space-y-8 py-8">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
            <svg
              className="w-12 h-12 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            Hub Launched Successfully!
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto text-pretty">
            Your Solora Smart Home Hub is now ready. Welcome to your connected home.
          </p>
        </div>

        <Card className="bg-card border-border max-w-md mx-auto">
          <CardContent className="p-6">
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Hub Name</span>
                <span className="font-medium text-foreground">{data.hubName}</span>
              </div>
              {data.hubAlias && (
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Alias</span>
                  <span className="font-medium text-foreground">{data.hubAlias}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Members</span>
                <span className="font-medium text-foreground">{data.members.length}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Theme</span>
                <span className="font-medium text-foreground capitalize">{data.theme}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button size="lg" className="w-full md:w-auto px-12">
          Go to Dashboard
          <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Launch Your Hub</h1>
        <p className="text-muted-foreground">
          Checking connections and preparing your smart home hub.
        </p>
      </div>

      {/* Connection Checks */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Connection Status</CardTitle>
          <CardDescription>Verifying all systems are operational.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {checkItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    checkStatuses[item.id] === "success"
                      ? "bg-primary/20 text-primary"
                      : checkStatuses[item.id] === "checking"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {checkStatuses[item.id] === "success" ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : checkStatuses[item.id] === "checking" ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-current" />
                  )}
                </div>
                <span className="text-foreground">{item.label}</span>
              </div>
              <span
                className={`text-sm ${
                  checkStatuses[item.id] === "success"
                    ? "text-primary"
                    : checkStatuses[item.id] === "checking"
                      ? "text-muted-foreground"
                      : "text-muted-foreground"
                }`}
              >
                {checkStatuses[item.id] === "success"
                  ? "Connected"
                  : checkStatuses[item.id] === "checking"
                    ? "Checking..."
                    : "Pending"}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-secondary/50 border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Setup Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-background/50">
              <p className="text-2xl font-bold text-primary">{data.hubName ? "1" : "0"}</p>
              <p className="text-xs text-muted-foreground">Hub</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <p className="text-2xl font-bold text-primary">{data.members.length}</p>
              <p className="text-xs text-muted-foreground">Members</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <p className="text-2xl font-bold text-primary capitalize">{data.theme.charAt(0)}</p>
              <p className="text-xs text-muted-foreground">Theme</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <p className="text-2xl font-bold text-primary">{data.brightness}%</p>
              <p className="text-xs text-muted-foreground">Brightness</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between gap-4">
        <Button variant="outline" onClick={onBack} className="bg-transparent">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back
        </Button>
        <Button onClick={handleLaunch} disabled={status !== "success"}>
          {status === "checking" ? (
            <>
              <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Checking...
            </>
          ) : (
            <>
              Launch Hub
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                />
              </svg>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
