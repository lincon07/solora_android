"use client";

import { DangerZoneSection } from "./components/danger-zone";
import { DisplaySection } from "./components/display";
import { HubSettingsSection } from "./components/hub";
import { MembersSection } from "./components/members";
import { NotificationsSection } from "./components/notifications";
import { Settings as SettingsIcon } from "lucide-react";

export function Settings() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-8 pb-16 space-y-8">

        {/* Header */}
        <header className="glass rounded-3xl px-6 py-5 shadow-lg flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[oklch(0.75_0.2_350)] to-[oklch(0.7_0.18_290)] flex items-center justify-center shadow-md">
            <SettingsIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your Solora Hub</p>
          </div>
        </header>

        {/* Row 1: Hub Settings + Members side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass rounded-3xl p-6 shadow-lg">
            <HubSettingsSection />
          </div>
          <div className="glass rounded-3xl p-6 shadow-lg">
            <MembersSection />
          </div>
        </div>

        {/* Row 2: Display + Notifications side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass rounded-3xl p-6 shadow-lg">
            <DisplaySection />
          </div>
          <div className="glass rounded-3xl p-6 shadow-lg">
            <NotificationsSection />
          </div>
        </div>

        {/* Row 3: Danger Zone — full width */}
        <div className="glass rounded-3xl p-6 shadow-lg border border-destructive/20">
          <DangerZoneSection />
        </div>

      </div>
    </div>
  );
}
