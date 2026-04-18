"use client";

import { DangerZoneSection } from "./components/danger-zone";
import { DisplaySection } from "./components/display";
import { HubSettingsSection } from "./components/hub";
import { MembersSection } from "./components/members";
import { NotificationsSection } from "./components/notifications";


export function Settings() {
  return (
    <div className="h-screen bg-background overflow-y-auto">
      <div className="max-w-md mx-auto px-5 py-8 space-y-10 pb-16">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your Solora Hub
          </p>
        </header>

        {/* Hub Settings */}
        <section>
          <HubSettingsSection />
        </section>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Members */}
        <section>
          <MembersSection />
        </section>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Display */}
        <section>
          <DisplaySection />
        </section>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Notifications */}
        <section>
          <NotificationsSection />
        </section>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Danger Zone */}
        <section>
          <DangerZoneSection />
        </section>
      </div>
    </div>
  );
}
