"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OnboardingData } from "../../onboard-wizzard"

type HubNameStepProps = {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

export function HubNameStep({ data, updateData, onNext, onBack }: HubNameStepProps) {
  const isValid = data.hubName.trim().length > 0

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Name Your Hub</h1>
        <p className="text-muted-foreground">
          Give your smart home hub a name and optional alias for easy identification.
        </p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Hub Details</CardTitle>
          <CardDescription>This information helps identify your hub across devices.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hubName">Hub Name *</Label>
            <Input
              id="hubName"
              placeholder="e.g., Home Central"
              value={data.hubName}
              onChange={(e) => updateData({ hubName: e.target.value })}
              className="bg-input border-border"
            />
            <p className="text-xs text-muted-foreground">
              This will be displayed on your hub screen and in the app.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hubAlias">
              Alias <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="hubAlias"
              placeholder="e.g., Living Room Hub"
              value={data.hubAlias}
              onChange={(e) => updateData({ hubAlias: e.target.value })}
              className="bg-input border-border"
            />
            <p className="text-xs text-muted-foreground">
              A friendly name for voice commands and quick access.
            </p>
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
        <Button onClick={onNext} disabled={!isValid}>
          Continue
          <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
