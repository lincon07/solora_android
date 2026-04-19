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
import { Check, Bell, Volume2, MapPin, Clock } from "lucide-react";

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
      {/* Header with fun icon */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[oklch(0.75_0.14_185)] to-[oklch(0.7_0.16_145)] flex items-center justify-center shadow-md animate-bounce-gentle">
          <Bell className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Notifications</h2>
          <p className="text-sm text-muted-foreground">Stay in the loop!</p>
        </div>
      </div>

      {/* Position Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Where to show alerts
        </Label>
        <Select value={position} onValueChange={(v) => setPosition(v as Position)}>
          <SelectTrigger className="h-14 text-base rounded-2xl bg-card border-2 border-border hover:border-[oklch(0.75_0.14_185)] transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {positionOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="h-12 rounded-lg text-base">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Visual position preview */}
        <div className="h-24 rounded-2xl bg-muted/30 border-2 border-dashed border-muted relative">
          <div 
            className={`absolute w-16 h-8 rounded-lg bg-gradient-to-r from-[oklch(0.75_0.14_185)] to-[oklch(0.7_0.16_145)] shadow-md transition-all ${
              position === "top-left" ? "top-2 left-2" :
              position === "top-center" ? "top-2 left-1/2 -translate-x-1/2" :
              position === "top-right" ? "top-2 right-2" :
              position === "bottom-left" ? "bottom-2 left-2" :
              position === "bottom-center" ? "bottom-2 left-1/2 -translate-x-1/2" :
              "bottom-2 right-2"
            }`}
          />
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Clock className="w-4 h-4" />
          How long to show
        </Label>
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger className="h-14 text-base rounded-2xl bg-card border-2 border-border hover:border-[oklch(0.75_0.14_185)] transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="3" className="h-12 rounded-lg text-base">3 seconds (quick peek)</SelectItem>
            <SelectItem value="5" className="h-12 rounded-lg text-base">5 seconds (just right)</SelectItem>
            <SelectItem value="10" className="h-12 rounded-lg text-base">10 seconds (take your time)</SelectItem>
            <SelectItem value="0" className="h-12 rounded-lg text-base">Until I tap it</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sound Toggle - Fun card */}
      <div className="rounded-2xl bg-gradient-to-br from-card to-muted/30 border-2 border-border overflow-hidden">
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                soundEnabled 
                  ? "bg-gradient-to-br from-[oklch(0.75_0.18_290)] to-[oklch(0.65_0.16_260)]"
                  : "bg-muted"
              }`}>
                <Volume2 className={`w-6 h-6 ${soundEnabled ? "text-white" : "text-muted-foreground"}`} />
              </div>
              <div>
                <span className="text-base font-semibold text-foreground">Sound Effects</span>
                <p className="text-sm text-muted-foreground">Ding dong!</p>
              </div>
            </div>
            <Switch 
              checked={soundEnabled} 
              onCheckedChange={setSoundEnabled}
              className="data-[state=checked]:bg-[oklch(0.75_0.18_290)]"
            />
          </div>
        </div>

        {/* Volume Slider */}
        {soundEnabled && (
          <div className="px-5 pb-5 pt-0 border-t border-border/50">
            <div className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium text-muted-foreground">Volume</Label>
                <span className="text-lg font-bold text-[oklch(0.75_0.18_290)]">{soundVolume[0]}%</span>
              </div>
              <div className="flex items-center gap-4">
                <Volume2 className="w-4 h-4 text-muted-foreground shrink-0" />
                <Slider
                  value={soundVolume}
                  onValueChange={setSoundVolume}
                  min={0}
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <Volume2 className="w-6 h-6 text-[oklch(0.75_0.18_290)] shrink-0" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <Button 
        className="w-full h-14 text-lg font-semibold rounded-2xl bg-gradient-to-r from-[oklch(0.75_0.14_185)] to-[oklch(0.7_0.16_145)] hover:opacity-90 transition-opacity shadow-lg"
        onClick={handleSave}
      >
        {saved ? (
          <span className="flex items-center gap-2">
            <Check className="w-6 h-6" />
            Saved!
          </span>
        ) : (
          "Save Changes"
        )}
      </Button>
    </div>
  );
}
