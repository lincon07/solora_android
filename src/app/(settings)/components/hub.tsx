"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Check, Pencil, Home, Globe, Sparkles } from "lucide-react"

import { fetchHubMe } from "@/api/hub"
import { updateHubSettings } from "@/api/hub"

const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
]

export function HubSettingsSection() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [hubId, setHubId] = useState<string | null>(null)

  const [hubName, setHubName] = useState("")
  const [hubAlias, setHubAlias] = useState("")
  const [timezone, setTimezone] = useState("America/New_York")

  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingAlias, setIsEditingAlias] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchHubMe()
        if (!res?.hub) return

        setHubId(res.hub.id)
        setHubName(res.hub.name)
        setHubAlias(res.hub.alias ?? "")
        setTimezone(res.hub.timezone ?? "America/New_York")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  async function handleSave() {
    if (!hubId) return

    setSaving(true)
    await updateHubSettings({
      name: hubName,
      alias: hubAlias || null,
      timezone,
    })

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <div className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
        Loading hub settings...
      </div>
    )
  }

  if (!hubId) {
    return (
      <div className="rounded-2xl bg-card border-2 border-dashed border-muted p-6 text-center">
        <Home className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground font-medium">Hub not paired yet</p>
        <p className="text-sm text-muted-foreground/70 mt-1">Connect your hub to manage settings</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with fun icon */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[oklch(0.75_0.2_350)] to-[oklch(0.7_0.18_290)] flex items-center justify-center shadow-md">
          <Home className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Hub Settings</h2>
          <p className="text-sm text-muted-foreground">
            Your family command center
          </p>
        </div>
      </div>

      {/* Hub Name */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Hub Name
        </Label>
        <Field
          value={hubName}
          editing={isEditingName}
          setEditing={setIsEditingName}
          onChange={setHubName}
        />
      </div>

      {/* Hub Alias */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-muted-foreground">Hub Alias</Label>
        <Field
          value={hubAlias}
          editing={isEditingAlias}
          setEditing={setIsEditingAlias}
          onChange={setHubAlias}
          placeholder="Give it a fun nickname!"
        />
      </div>

      {/* Timezone */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Time Zone
        </Label>
        <Select value={timezone} onValueChange={setTimezone}>
          <SelectTrigger className="h-14 text-base rounded-2xl bg-card border-2 border-border hover:border-[oklch(0.75_0.15_350)] transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {timezones.map((tz) => (
              <SelectItem key={tz.value} value={tz.value} className="h-12 rounded-lg">
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        className="w-full h-14 text-lg font-semibold rounded-2xl bg-gradient-to-r from-[oklch(0.75_0.2_350)] to-[oklch(0.7_0.18_290)] hover:opacity-90 transition-opacity shadow-lg"
        onClick={handleSave}
        disabled={saving}
      >
        {saved ? (
          <span className="flex items-center gap-2">
            <Check className="w-6 h-6" />
            Saved!
          </span>
        ) : saving ? (
          <span className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            Saving...
          </span>
        ) : (
          "Save Changes"
        )}
      </Button>
    </div>
  )
}

function Field({
  value,
  editing,
  setEditing,
  onChange,
  placeholder,
}: {
  value: string
  editing: boolean
  setEditing: (v: boolean) => void
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="flex gap-3">
      {editing ? (
        <>
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-14 text-base rounded-2xl border-2 focus:border-[oklch(0.75_0.15_350)]"
            autoFocus
          />
          <Button 
            size="icon" 
            onClick={() => setEditing(false)}
            className="h-14 w-14 rounded-2xl bg-[oklch(0.75_0.18_145)] hover:bg-[oklch(0.7_0.16_145)]"
          >
            <Check className="w-6 h-6" />
          </Button>
        </>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="flex-1 h-14 px-5 rounded-2xl bg-card border-2 border-border hover:border-[oklch(0.75_0.15_350)] flex items-center justify-between transition-all group"
        >
          <span className={value ? "text-foreground font-medium" : "text-muted-foreground"}>
            {value || placeholder}
          </span>
          <Pencil className="w-5 h-5 text-muted-foreground group-hover:text-[oklch(0.75_0.15_350)] transition-colors" />
        </button>
      )}
    </div>
  )
}
