"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Trash2, Unlink, RotateCcw, Database, ShieldAlert } from "lucide-react";
import { soloras } from "@/lib/tauri";

type DangerAction = "reset" | "unpair" | "cache" | null;

const dangerActions = [
  {
    id: "cache" as const,
    icon: Database,
    title: "Clear Cache",
    description: "Clear all cached data and temporary files",
    buttonText: "Clear Cache",
    confirmText: "CLEAR",
    warning: "This will clear all cached data. Your settings will be preserved.",
    color: "from-[oklch(0.78_0.18_55)] to-[oklch(0.7_0.16_55)]",
  },
  {
    id: "unpair" as const,
    icon: Unlink,
    title: "Unpair Hub",
    description: "Disconnect this hub from your account",
    buttonText: "Unpair Hub",
    confirmText: "UNPAIR",
    warning: "This will disconnect the hub from your account. You can pair it again later.",
    color: "from-[oklch(0.75_0.16_25)] to-[oklch(0.65_0.18_25)]",
  },
  {
    id: "reset" as const,
    icon: RotateCcw,
    title: "Factory Reset",
    description: "Erase all data and restore factory settings",
    buttonText: "Factory Reset",
    confirmText: "RESET",
    warning: "This action cannot be undone. All data, settings, and paired devices will be permanently deleted.",
    color: "from-[oklch(0.65_0.22_25)] to-[oklch(0.55_0.2_15)]",
  },
];

export function DangerZoneSection() {
  const [activeAction, setActiveAction] = useState<DangerAction>(null);
  const [confirmInput, setConfirmInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const token = async () => {
      await soloras.getDeviceToken().then((token) => {
        if (!token) {
          console.log("No device token found, redirecting to onboarding...");
        }
        console.log("Device token found:", token);
      });
    }
    token();
  }, []);

  const currentAction = dangerActions.find((a) => a.id === activeAction);

  const handleConfirm = () => {
    if (!currentAction || confirmInput !== currentAction.confirmText) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setActiveAction(null);
      setConfirmInput("");
    }, 2000);
  };

  const closeDialog = () => {
    if (isProcessing) return;
    setActiveAction(null);
    setConfirmInput("");
  };

  return (
    <div className="space-y-6">
      {/* Header with warning icon */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[oklch(0.65_0.22_25)] to-[oklch(0.55_0.2_15)] flex items-center justify-center shadow-md">
          <ShieldAlert className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Danger Zone</h2>
          <p className="text-sm text-muted-foreground">Be careful here!</p>
        </div>
      </div>

      {/* Warning Banner - Playful but serious */}
      <div className="rounded-2xl bg-gradient-to-r from-[oklch(0.95_0.06_25)] to-[oklch(0.92_0.08_55)] border-2 border-[oklch(0.85_0.12_25)] p-4 flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-[oklch(0.6_0.2_25)] shrink-0 mt-0.5" />
        <p className="text-sm text-[oklch(0.45_0.12_25)] font-medium">
          These actions can result in permanent data loss. Please proceed with caution!
        </p>
      </div>

      {/* Action Cards */}
      <div className="space-y-4">
        {dangerActions.map((action) => {
          const IconComponent = action.icon;
          
          return (
            <div
              key={action.id}
              className="rounded-2xl glass hover:bg-white/60 p-5 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shrink-0`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {action.description}
                  </p>
                  <Button
                    variant="destructive"
                    className="mt-4 h-12 px-6 rounded-xl font-semibold"
                    onClick={() => setActiveAction(action.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {action.buttonText}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={!!activeAction} onOpenChange={closeDialog}>
        <DialogContent className="bg-card border-2 border-border max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-destructive text-xl">
              <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              {currentAction?.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground pt-3 text-base">
              {currentAction?.warning}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-3">
              Type <span className="font-mono font-bold text-foreground bg-muted px-2 py-1 rounded">{currentAction?.confirmText}</span> to confirm
            </p>
            <Input
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value.toUpperCase())}
              placeholder={`Type ${currentAction?.confirmText}`}
              className="h-14 text-lg rounded-xl bg-input border-2 border-border font-mono"
              disabled={isProcessing}
            />
          </div>

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={closeDialog}
              className="flex-1 h-12 rounded-xl border-2"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              className="flex-1 h-12 rounded-xl font-semibold"
              disabled={confirmInput !== currentAction?.confirmText || isProcessing}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Processing...
                </span>
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
