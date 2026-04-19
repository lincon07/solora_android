"use client";

import { DangerZoneSection } from "./components/danger-zone";
import { DisplaySection } from "./components/display";
import { HubSettingsSection } from "./components/hub";
import { MembersSection } from "./components/members";
import { NotificationsSection } from "./components/notifications";
import { FloatingClouds, SunnyCorner, GrassAndFlowers, CuteBunny } from "@/components/ui/fun-decorations";
import { Settings as SettingsIcon } from "lucide-react";


export function Settings() {
  return (
    <div className="h-screen bg-background overflow-y-auto relative">
      {/* Fun background decorations */}
      <FloatingClouds className="opacity-40" />
      <SunnyCorner className="opacity-80" />
      
      <div className="max-w-md mx-auto px-5 py-8 space-y-10 pb-24 relative z-10">
        {/* Header with fun styling */}
        <header className="relative">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[oklch(0.75_0.2_350)] to-[oklch(0.7_0.18_290)] flex items-center justify-center shadow-lg">
              <SettingsIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your Solora Hub
              </p>
            </div>
          </div>
          {/* Decorative bunny */}
          <CuteBunny className="absolute -right-2 top-0" size="sm" />
        </header>

        {/* Hub Settings */}
        <section className="relative">
          <div className="absolute -left-3 top-0 w-1.5 h-full rounded-full bg-gradient-to-b from-[oklch(0.75_0.18_350)] to-[oklch(0.7_0.16_290)]" />
          <HubSettingsSection />
        </section>

        {/* Playful divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[oklch(0.85_0.1_350)] to-transparent" />
          <svg className="w-6 h-6 text-[oklch(0.8_0.16_350)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14.5 9H22L16 14L18.5 22L12 17L5.5 22L8 14L2 9H9.5L12 2Z" />
          </svg>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[oklch(0.85_0.1_350)] to-transparent" />
        </div>

        {/* Members */}
        <section className="relative">
          <div className="absolute -left-3 top-0 w-1.5 h-full rounded-full bg-gradient-to-b from-[oklch(0.75_0.14_290)] to-[oklch(0.7_0.16_240)]" />
          <MembersSection />
        </section>

        {/* Playful divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[oklch(0.85_0.12_240)] to-transparent" />
          <svg className="w-5 h-5 text-[oklch(0.75_0.14_240)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[oklch(0.85_0.12_240)] to-transparent" />
        </div>

        {/* Display */}
        <section className="relative">
          <div className="absolute -left-3 top-0 w-1.5 h-full rounded-full bg-gradient-to-b from-[oklch(0.9_0.16_95)] to-[oklch(0.78_0.18_55)]" />
          <DisplaySection />
        </section>

        {/* Playful divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[oklch(0.88_0.14_95)] to-transparent" />
          <svg className="w-6 h-6 text-[oklch(0.85_0.14_95)]" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[oklch(0.88_0.14_95)] to-transparent" />
        </div>

        {/* Notifications */}
        <section className="relative">
          <div className="absolute -left-3 top-0 w-1.5 h-full rounded-full bg-gradient-to-b from-[oklch(0.75_0.14_185)] to-[oklch(0.7_0.16_145)]" />
          <NotificationsSection />
        </section>

        {/* Playful divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[oklch(0.8_0.12_185)] to-transparent" />
          <svg className="w-5 h-5 text-[oklch(0.75_0.14_185)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[oklch(0.8_0.12_185)] to-transparent" />
        </div>

        {/* Danger Zone */}
        <section className="relative">
          <div className="absolute -left-3 top-0 w-1.5 h-full rounded-full bg-gradient-to-b from-[oklch(0.65_0.22_25)] to-[oklch(0.55_0.2_25)]" />
          <DangerZoneSection />
        </section>
      </div>
      
      {/* Bottom grass decoration */}
      <GrassAndFlowers className="fixed bottom-0 left-0 right-0 z-0" />
    </div>
  );
}
