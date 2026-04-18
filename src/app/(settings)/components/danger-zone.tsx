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
import { AlertTriangle, Trash2, Unlink, RotateCcw, Database } from "lucide-react";
import { soloras } from "@/lib/tauri";

type DangerAction = "reset" | "unpair" | "cache" | null;

const dangerActions = [
  {
    id: "cache" as const,
    icon: <Database className="w-5 h-5" />,
    title: "Clear Cache",
    description: "Clear all cached data and temporary files",
    buttonText: "Clear Cache",
    confirmText: "CLEAR",
    warning: "This will clear all cached data. Your settings will be preserved.",
  },
  {
    id: "unpair" as const,
    icon: <Unlink className="w-5 h-5" />,
    title: "Unpair Hub",
    description: "Disconnect this hub from your account",
    buttonText: "Unpair Hub",
    confirmText: "UNPAIR",
    warning: "This will disconnect the hub from your account. You can pair it again later.",
  },
  {
    id: "reset" as const,
    icon: <RotateCcw className="w-5 h-5" />,
    title: "Factory Reset",
    description: "Erase all data and restore factory settings",
    buttonText: "Factory Reset",
    confirmText: "RESET",
    warning: "This action cannot be undone. All data, settings, and paired devices will be permanently deleted.",
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
        console.log("✅ Device token found:", token);
      });

    }
    token();
  }, []);

  const currentAction = dangerActions.find((a) => a.id === activeAction);

  const handleConfirm = () => {
    if (!currentAction || confirmInput !== currentAction.confirmText) return;
    
    setIsProcessing(true);
    // Simulate processing
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
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Danger Zone</h2>
          <p className="text-sm text-muted-foreground">Destructive actions</p>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4">
        <p className="text-sm text-destructive">
          These actions can result in permanent data loss. Please proceed with caution.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {dangerActions.map((action) => (
          <div
            key={action.id}
            className="rounded-xl bg-card border border-border p-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0 text-destructive">
                {action.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-foreground">
                  {action.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {action.description}
                </p>
                <Button
                  variant="destructive"
                  className="mt-3 h-11"
                  onClick={() => setActiveAction(action.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {action.buttonText}
                </Button>
              </div>
            </div>
          </div>
        ))}

        <h1>
          {}
        </h1>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={!!activeAction} onOpenChange={closeDialog}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              {currentAction?.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground pt-2">
              {currentAction?.warning}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-2">
              Type <span className="font-mono font-bold text-foreground">{currentAction?.confirmText}</span> to confirm
            </p>
            <Input
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value.toUpperCase())}
              placeholder={`Type ${currentAction?.confirmText}`}
              className="h-12 text-base bg-input border-border font-mono"
              disabled={isProcessing}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={closeDialog}
              className="flex-1 h-12 bg-transparent"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              className="flex-1 h-12"
              disabled={confirmInput !== currentAction?.confirmText || isProcessing}
            >
              {isProcessing ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
