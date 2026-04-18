"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Bell, Volume2 } from "lucide-react";

type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";

const positionOptions: { value: Position; label: string }[] = [
  { value: "top-left", label: "Top Left" },
  { value: "top-center", label: "Top Center" },
  { value: "top-right", label: "Top Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-center", label: "Bottom Center" },
  { value: "bottom-right", label: "Bottom Right" },
];

export function NotificationsSection() {
  const [position, setPosition] = useState<Position>("top-right");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState([70]);
  const [duration, setDuration] = useState("5");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <Bell className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          <p className="text-sm text-muted-foreground">Alert position and sound</p>
        </div>
      </div>

      {/* Position Selection */}
      <div className="space-y-3">
        <Label className="text-sm text-muted-foreground">Position</Label>
        <Select value={position} onValueChange={(v) => setPosition(v as Position)}>
          <SelectTrigger className="h-12 text-base bg-input border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {positionOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="h-11 text-base">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Duration */}
      <div className="space-y-3">
        <Label className="text-sm text-muted-foreground">Display Duration</Label>
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger className="h-12 text-base bg-input border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="3" className="h-11 text-base">3 seconds</SelectItem>
            <SelectItem value="5" className="h-11 text-base">5 seconds</SelectItem>
            <SelectItem value="10" className="h-11 text-base">10 seconds</SelectItem>
            <SelectItem value="0" className="h-11 text-base">Until dismissed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sound Toggle */}
      <div className="rounded-xl bg-card border border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-muted-foreground" />
            <div>
              <span className="text-base font-medium text-foreground">Sound</span>
              <p className="text-sm text-muted-foreground">Play sound on alerts</p>
            </div>
          </div>
          <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
        </div>

        {/* Volume Slider */}
        {soundEnabled && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm text-muted-foreground">Volume</Label>
              <span className="text-sm text-foreground">{soundVolume[0]}%</span>
            </div>
            <Slider
              value={soundVolume}
              onValueChange={setSoundVolume}
              min={0}
              max={100}
              step={5}
              className="py-2"
            />
          </div>
        )}
      </div>

      {/* Save Button */}
      <Button className="w-full h-14 text-base font-medium" onClick={handleSave}>
        {saved ? (
          <>
            <Check className="w-5 h-5 mr-2" />
            Saved
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </div>
  );
}
