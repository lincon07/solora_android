"use client";

import React from "react"
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Sun, Moon, Monitor, Check, Palette, Timer, Lightbulb } from "lucide-react";
import { useTheme } from "@/providers/theme";

type Theme = "light" | "dark" | "system";

const themeOptions: { value: Theme; label: string; icon: React.ReactNode; color: string }[] = [
    { value: "light", label: "Light", icon: <Sun className="w-6 h-6" />, color: "from-[oklch(0.9_0.16_95)] to-[oklch(0.85_0.14_55)]" },
    { value: "dark", label: "Dark", icon: <Moon className="w-6 h-6" />, color: "from-[oklch(0.5_0.15_290)] to-[oklch(0.4_0.12_260)]" },
    { value: "system", label: "Auto", icon: <Monitor className="w-6 h-6" />, color: "from-[oklch(0.75_0.14_185)] to-[oklch(0.65_0.12_185)]" },
];

const screenSaverOptions = [
    { value: "1", label: "1 minute" },
    { value: "2", label: "2 minutes" },
    { value: "5", label: "5 minutes" },
    { value: "10", label: "10 minutes" },
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "never", label: "Never" },
];

export function DisplaySection() {
    const { theme, setTheme } = useTheme()
    const [brightness, setBrightness] = useState([75]);
    const [screenSaver, setScreenSaver] = useState("5");
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header with fun icon */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[oklch(0.9_0.16_95)] to-[oklch(0.78_0.18_55)] flex items-center justify-center shadow-md">
                    <Palette className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-foreground">Display</h2>
                    <p className="text-sm text-muted-foreground">Make it look awesome!</p>
                </div>
            </div>

            {/* Theme Selection - Playful cards */}
            <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">Choose Your Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                    {themeOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setTheme(option.value)}
                            className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${
                                theme === option.value
                                    ? "border-[oklch(0.75_0.2_350)] bg-card shadow-lg scale-105"
                                    : "border-border bg-card/50 hover:border-muted-foreground hover:scale-102"
                            }`}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center text-white shadow-md`}>
                                {option.icon}
                            </div>
                            <span className={`text-sm font-semibold ${
                                theme === option.value ? "text-foreground" : "text-muted-foreground"
                            }`}>
                                {option.label}
                            </span>
                            {theme === option.value && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[oklch(0.75_0.2_350)] flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Brightness - Fun slider */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Screen Brightness
                    </Label>
                    <span className="text-lg font-bold text-[oklch(0.85_0.14_95)]">{brightness[0]}%</span>
                </div>
                <div className="flex items-center gap-4">
                    <Sun className="w-5 h-5 text-muted-foreground shrink-0" />
                    <Slider
                        value={brightness}
                        onValueChange={(val) => setBrightness(val)}
                        max={100}
                        min={10}
                        step={5}
                        className="flex-1"
                    />
                    <Sun className="w-6 h-6 text-[oklch(0.85_0.14_95)] shrink-0" />
                </div>
                {/* Fun brightness preview */}
                <div
                    className="h-20 rounded-2xl border-2 border-border flex items-center justify-center transition-all relative overflow-hidden"
                    style={{
                        background: `linear-gradient(135deg, oklch(${0.5 + brightness[0] / 200} 0.12 95), oklch(${0.4 + brightness[0] / 200} 0.1 55))`,
                    }}
                >
                    <Sun 
                        className="w-10 h-10 text-white animate-wiggle"
                        style={{ opacity: brightness[0] / 100 }}
                    />
                </div>
            </div>

            {/* Screen Saver Timeout */}
            <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Timer className="w-4 h-4" />
                    Screen Saver
                </Label>
                <Select value={screenSaver} onValueChange={setScreenSaver}>
                    <SelectTrigger className="h-14 text-base rounded-2xl bg-card border-2 border-border hover:border-[oklch(0.75_0.15_350)] transition-colors">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        {screenSaverOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="h-12 rounded-lg text-base">
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground bg-muted/30 rounded-xl p-3">
                    Screen will dim after {screenSaver === "never" ? "never (always on)" : `${screenSaver} minute${screenSaver === "1" ? "" : "s"} of inactivity`}
                </p>
            </div>

            {/* Auto-Brightness Toggle - Fun card */}
            <div className="rounded-2xl bg-gradient-to-br from-card to-muted/30 border-2 border-border p-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[oklch(0.75_0.14_185)] to-[oklch(0.65_0.12_145)] flex items-center justify-center">
                            <Lightbulb className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="text-base font-semibold text-foreground">Auto Brightness</span>
                            <p className="text-sm text-muted-foreground">
                                Smart light sensing
                            </p>
                        </div>
                    </div>
                    <button
                        className={`w-14 h-8 rounded-full transition-all relative ${
                            brightness[0] > 50 
                                ? "bg-gradient-to-r from-[oklch(0.75_0.18_145)] to-[oklch(0.7_0.16_185)]" 
                                : "bg-muted"
                        }`}
                        onClick={() => setBrightness(brightness[0] > 50 ? [30] : [75])}
                    >
                        <span
                            className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${
                                brightness[0] > 50 ? "right-1" : "left-1"
                            }`}
                        />
                    </button>
                </div>
            </div>

            {/* Save Button */}
            <Button 
                className="w-full h-14 text-lg font-semibold rounded-2xl bg-gradient-to-r from-[oklch(0.9_0.16_95)] to-[oklch(0.78_0.18_55)] hover:opacity-90 transition-opacity shadow-lg text-[oklch(0.3_0.08_55)]"
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
