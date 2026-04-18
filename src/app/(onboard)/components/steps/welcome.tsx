"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, Users, Palette, ArrowRight } from "lucide-react"
import { Mascot, FloatingShapes, RainbowBanner } from "@/components/ui/mascot"

type WelcomeStepProps = {
  onNext: () => void
}

const features = [
  {
    icon: Zap,
    title: "Super Fast Controls",
    description: "Control all your home gadgets with one tap!",
    colorClass: "icon-bg-sunny",
    mascot: "star" as const,
  },
  {
    icon: Users,
    title: "Family Fun",
    description: "Everyone in the family can join and help out!",
    colorClass: "icon-bg-pink",
    mascot: "heart" as const,
  },
  {
    icon: Palette,
    title: "Make It Yours",
    description: "Pick your favorite colors and themes!",
    colorClass: "icon-bg-purple",
    mascot: "rainbow" as const,
  },
]

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="text-center space-y-8 relative">
      {/* Floating decorative elements */}
      <FloatingShapes className="opacity-40" />

      {/* Fun mascot greeting */}
      <div className="flex justify-center relative z-10">
        <div className="relative">
          <Mascot type="house" size="xl" mood="happy" />
          {/* Decorative sparkles around mascot */}
          <div className="absolute -top-2 -left-4">
            <Mascot type="star" size="sm" animate />
          </div>
          <div className="absolute -top-4 -right-2">
            <Mascot type="heart" size="sm" animate />
          </div>
        </div>
      </div>

      {/* Content with rainbow text */}
      <div className="space-y-4 relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground text-balance">
          Welcome to <span className="text-rainbow">Solora!</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto text-pretty font-medium">
          Your family&apos;s awesome smart home helper. Let&apos;s get started!
        </p>
      </div>

      {/* Features with mascots */}
      <Card className="bg-card/80 backdrop-blur-sm border-2 border-border rounded-3xl shadow-xl relative z-10">
        <CardContent className="p-6">
          <div className="grid gap-6 text-left">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex items-start gap-4 group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${feature.colorClass} shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="pt-1 flex-1">
                    <h3 className="font-bold text-foreground text-lg">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground font-medium">{feature.description}</p>
                  </div>
                  <div className="w-12 h-12 opacity-60 group-hover:opacity-100 transition-opacity">
                    <Mascot type={feature.mascot} size="sm" animate={false} />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Fun rainbow CTA */}
      <div className="relative z-10">
        <Button 
          size="lg" 
          onClick={onNext} 
          className="w-full md:w-auto px-12 h-16 text-xl rounded-2xl shadow-xl btn-bubble bg-gradient-to-r from-primary via-[oklch(0.7500_0.1800_290)] to-accent hover:opacity-90 border-0"
        >
          Let&apos;s Go!
          <ArrowRight className="w-6 h-6 ml-2" />
        </Button>
      </div>

      {/* Fun footer message */}
      <p className="text-sm text-muted-foreground font-medium relative z-10">
        This will only take a minute - promise!
      </p>
    </div>
  )
}
