"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OnboardingData } from "../../onboard-wizzard"
import { Home, ArrowLeft, ArrowRight, Sparkles, Tag } from "lucide-react"
import { CuteDog, FloatingHearts } from "@/components/ui/fun-decorations"

type HubNameStepProps = {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

export function HubNameStep({ data, updateData, onNext, onBack }: HubNameStepProps) {
  const isValid = data.hubName.trim().length > 0

  return (
    <div className="space-y-8 relative">
      {/* Fun decorations */}
      <FloatingHearts className="opacity-40" />
      
      {/* Header with cute dog mascot */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[oklch(0.78_0.18_55)] to-[oklch(0.7_0.16_25)] flex items-center justify-center shadow-lg">
              <Home className="w-10 h-10 text-white" />
            </div>
            <CuteDog size="sm" className="absolute -right-6 -bottom-2" />
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">Name Your Hub</h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Give your smart home a fun name that the whole family will love!
          </p>
        </div>
      </div>

      {/* Form card with playful styling */}
      <div className="rounded-3xl bg-card border-2 border-border shadow-lg overflow-hidden">
        <div className="p-6 border-b border-border bg-gradient-to-r from-card to-muted/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[oklch(0.9_0.14_95)] to-[oklch(0.85_0.12_55)] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[oklch(0.5_0.14_55)]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Hub Details</h2>
              <p className="text-sm text-muted-foreground">This helps identify your hub</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <Label htmlFor="hubName" className="text-base font-semibold flex items-center gap-2">
              <Home className="w-4 h-4 text-[oklch(0.75_0.18_55)]" />
              Hub Name
              <span className="text-[oklch(0.75_0.2_350)]">*</span>
            </Label>
            <Input
              id="hubName"
              placeholder="e.g., The Smith Family Hub"
              value={data.hubName}
              onChange={(e) => updateData({ hubName: e.target.value })}
              className="h-14 text-lg rounded-2xl bg-input border-2 border-border focus:border-[oklch(0.75_0.15_55)]"
            />
            <p className="text-sm text-muted-foreground bg-muted/30 rounded-xl p-3">
              This will be displayed on your hub screen and in the app
            </p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="hubAlias" className="text-base font-semibold flex items-center gap-2">
              <Tag className="w-4 h-4 text-[oklch(0.75_0.14_185)]" />
              Nickname
              <span className="text-muted-foreground text-sm font-normal">(Optional)</span>
            </Label>
            <Input
              id="hubAlias"
              placeholder="e.g., Home Sweet Home"
              value={data.hubAlias}
              onChange={(e) => updateData({ hubAlias: e.target.value })}
              className="h-14 text-lg rounded-2xl bg-input border-2 border-border focus:border-[oklch(0.75_0.14_185)]"
            />
            <p className="text-sm text-muted-foreground bg-muted/30 rounded-xl p-3">
              A fun nickname for voice commands and quick access
            </p>
          </div>
        </div>
      </div>

      {/* Navigation with playful buttons */}
      <div className="flex justify-between gap-4 pt-4">
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="h-14 px-6 rounded-2xl bg-transparent border-2 font-semibold"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!isValid}
          className="h-14 px-8 rounded-2xl bg-gradient-to-r from-[oklch(0.78_0.18_55)] to-[oklch(0.7_0.16_25)] hover:opacity-90 shadow-lg font-semibold text-lg"
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
