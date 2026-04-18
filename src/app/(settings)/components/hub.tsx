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
import { Check, Pencil, Settings } from "lucide-react"

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

  /* --------------------------------------------
   * Load hub
   * ------------------------------------------ */
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

  /* --------------------------------------------
   * Save
   * ------------------------------------------ */
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
    return <div className="text-sm text-muted-foreground">Loading hub settings…</div>
  }

  if (!hubId) {
    return (
      <div className="text-sm text-muted-foreground">
        Hub not paired yet.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Hub Settings</h2>
          <p className="text-sm text-muted-foreground">
            Identity and location
          </p>
        </div>
      </div>

      {/* Hub Name */}
      <Field
        label="Hub Name"
        value={hubName}
        editing={isEditingName}
        setEditing={setIsEditingName}
        onChange={setHubName}
      />

      {/* Hub Alias */}
      <Field
        label="Hub Alias"
        value={hubAlias}
        editing={isEditingAlias}
        setEditing={setIsEditingAlias}
        onChange={setHubAlias}
        placeholder="No alias set"
      />

      {/* Timezone */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Time Zone</Label>
        <Select value={timezone} onValueChange={setTimezone}>
          <SelectTrigger className="h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timezones.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        className="w-full h-14"
        onClick={handleSave}
        disabled={saving}
      >
        {saved ? (
          <>
            <Check className="w-5 h-5 mr-2" />
            Saved
          </>
        ) : saving ? (
          "Saving…"
        ) : (
          "Save Changes"
        )}
      </Button>
    </div>
  )
}

/* --------------------------------------------
 * Reusable field
 * ------------------------------------------ */
function Field({
  label,
  value,
  editing,
  setEditing,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  editing: boolean
  setEditing: (v: boolean) => void
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <div className="flex gap-2">
        {editing ? (
          <>
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="h-12"
              autoFocus
            />
            <Button size="icon" onClick={() => setEditing(false)}>
              <Check />
            </Button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex-1 h-12 px-4 rounded-lg bg-input border flex items-center justify-between"
          >
            <span>{value || placeholder}</span>
            <Pencil className="w-4 h-4 opacity-60" />
          </button>
        )}
      </div>
    </div>
  )
}
