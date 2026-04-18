"use client"

import { useState } from "react"
import { HubNameStep } from "./components/steps/hub-name"
import { WelcomeStep } from "./components/steps/welcome"
import { MembersStep } from "./components/steps/members"
import { AppearanceStep } from "./components/steps/appearence"
import { ClaimHubStep } from "./components/steps/claim-hub"
import { ConnectivityStep } from "./components/steps/connectivity"
import { LaunchStep } from "./components/steps/launch" // optional final “done” page

export type Member = {
  id: string
  name: string
  email: string
  role: "admin" | "member" | "guest"
}

export type OnboardingData = {
  hubName: string
  hubAlias: string
  members: Member[]

  claimedHubId: string | null
  pairingId: string | null

  theme: "dark" | "light" | "system"
  brightness: number
  screenSaver: number
}

const STEPS = [
  { id: 1, title: "Welcome" },
  { id: 2, title: "Hub Setup" },
  { id: 3, title: "Members" },
  { id: 4, title: "Appearance" },
  { id: 5, title: "Connectivity" }, // ✅ moved earlier
  { id: 6, title: "Claim Hub" },     // ✅ after connectivity
  { id: 7, title: "Finish" },
]

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1)

  const [data, setData] = useState<OnboardingData>({
    hubName: "",
    hubAlias: "",
    members: [
      { id: "1", name: "John Doe", email: "john@example.com", role: "admin" },
      { id: "2", name: "Jane Smith", email: "jane@example.com", role: "member" },
      { id: "3", name: "Guest User", email: "guest@example.com", role: "guest" },
    ],

    claimedHubId: null,
    pairingId: null,

    theme: "dark",
    brightness: 80,
    screenSaver: 5,
  })

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-2">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                    currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : currentStep > step.id
                        ? "bg-primary/20 text-primary"
                        : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-xs font-medium">
                    {currentStep > step.id ? (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </span>
                  <span className="hidden lg:inline">{step.title}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 ${currentStep > step.id ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          <div className="md:hidden text-sm text-muted-foreground">
            Step {currentStep} of {STEPS.length}
          </div>
        </div>
      </header>

      <main className="flex items-center justify-center p-20">
        <div className="w-full max-w-2xl">
          {currentStep === 1 && <WelcomeStep onNext={nextStep} />}

          {currentStep === 2 && (
            <HubNameStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
          )}

          {currentStep === 3 && (
            <MembersStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
          )}

          {currentStep === 4 && (
            <AppearanceStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
          )}

          {currentStep === 5 && (
            <ConnectivityStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
          )}

          {currentStep === 6 && (
            <ClaimHubStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
          )}

          {currentStep === 7 && <LaunchStep data={data} onBack={prevStep} />}
        </div>
      </main>
    </div>
  )
}
