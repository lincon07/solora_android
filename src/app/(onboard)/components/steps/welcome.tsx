"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, Users, Palette, ArrowRight, Sparkles } from "lucide-react"

type WelcomeStepProps = {
  onNext: () => void
}

const features = [
  {
    icon: Zap,
    title: "Instant Control",
    description: "Control all your devices from one place",
    colorClass: "icon-bg-coral",
  },
  {
    icon: Users,
    title: "Family Sharing",
    description: "Invite family members with custom permissions",
    colorClass: "icon-bg-lavender",
  },
  {
    icon: Palette,
    title: "Personalize",
    description: "Customize themes and display settings",
    colorClass: "icon-bg-teal",
  },
]

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="text-center space-y-8">
      {/* Logo/Icon */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-3xl bg-primary shadow-lg flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-primary-foreground" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
          Welcome to Solora
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto text-pretty">
          Your family&apos;s smart home hub. Let&apos;s set things up in just a few quick steps.
        </p>
      </div>

      {/* Features */}
      <Card className="bg-card border-border rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="grid gap-5 text-left">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${feature.colorClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="pt-1">
                    <h3 className="font-semibold text-foreground text-lg">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Button size="lg" onClick={onNext} className="w-full md:w-auto px-10 h-14 text-lg rounded-xl shadow-md">
        Get Started
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  )
}
