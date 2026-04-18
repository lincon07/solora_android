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
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme } from "@/providers/theme";

type Theme = "light" | "dark" | "system";

const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun className="w-5 h-5" /> },
    { value: "dark", label: "Dark", icon: <Moon className="w-5 h-5" /> },
    { value: "system", label: "Auto", icon: <Monitor className="w-5 h-5" /> },
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
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <Monitor className="w-5 h-5 text-foreground" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-foreground">Display</h2>
                    <p className="text-sm text-muted-foreground">Appearance and screen</p>
                </div>
            </div>

            {/* Theme Selection */}
            <div className="space-y-3">
                <Label className="text-sm text-muted-foreground">Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                    {themeOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setTheme(option.value)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${theme === option.value
                                ? "bg-accent border-foreground"
                                : "bg-card border-border hover:border-muted-foreground"
                                }`}
                        >
                            <div
                                className={`${theme === option.value ? "text-foreground" : "text-muted-foreground"
                                    }`}
                            >
                                {option.icon}
                            </div>
                            <span
                                className={`text-sm font-medium ${theme === option.value ? "text-foreground" : "text-muted-foreground"
                                    }`}
                            >
                                {option.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Brightness */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-sm text-muted-foreground">Screen Brightness</Label>
                    <span className="text-sm font-medium text-foreground">{brightness[0]}%</span>
                </div>
                <div className="flex items-center gap-4">
                    <Sun className="w-4 h-4 text-muted-foreground shrink-0" />
                    <Slider
                        value={brightness}
                        onValueChange={(val) => {
                            setBrightness(val)
                        }}
                        max={100}
                        min={10}
                        step={5}
                    />
                    <Sun className="w-5 h-5 text-foreground shrink-0" />
                </div>
                {/* Brightness Preview */}
                <div
                    className="h-16 rounded-xl border border-border flex items-center justify-center transition-all"
                    style={{
                        backgroundColor: `rgba(255, 255, 255, ${brightness[0] / 100 * 0.15})`,
                    }}
                >
                    <span className="text-sm text-muted-foreground">Preview</span>
                </div>
            </div>

            {/* Screen Saver Timeout */}
            <div className="space-y-3">
                <Label className="text-sm text-muted-foreground">Screen Saver</Label>
                <Select value={screenSaver} onValueChange={setScreenSaver}>
                    <SelectTrigger className="h-12 text-base bg-input border-border">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                        {screenSaverOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="h-11 text-base">
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                    Screen will dim after {screenSaver === "never" ? "the timeout is disabled" : `${screenSaver} minute${screenSaver === "1" ? "" : "s"} of inactivity`}
                </p>
            </div>

            {/* Auto-Brightness Toggle */}
            <div className="rounded-xl bg-card border border-border p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-base font-medium text-foreground">Auto Brightness</span>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Adjust brightness based on ambient light
                        </p>
                    </div>
                    <button
                        className={`w-12 h-7 rounded-full transition-colors relative ${brightness[0] > 50 ? "bg-foreground" : "bg-muted"
                            }`}
                        onClick={() => setBrightness(brightness[0] > 50 ? [30] : [75])}
                    >
                        <span
                            className={`absolute top-1 w-5 h-5 rounded-full transition-all ${brightness[0] > 50
                                ? "right-1 bg-background"
                                : "left-1 bg-muted-foreground"
                                }`}
                        />
                    </button>
                </div>
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
