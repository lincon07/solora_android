"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import type { Calendar, HubMember } from "../../types";

interface CalendarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calendar: Calendar | null;
  members: HubMember[];
  onSave: (calendar: Omit<Calendar, "id">) => void;
  onDelete: (calendarId: string) => void;
}

const COLORS = [
  { value: "#ffffff", label: "White" },
  { value: "#a1a1a1", label: "Gray" },
  { value: "#525252", label: "Dark Gray" },
  { value: "#71717a", label: "Zinc" },
];

export function CalendarDialog({
  open,
  onOpenChange,
  calendar,
  members,
  onSave,
  onDelete,
}: CalendarDialogProps) {
  const [name, setName] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    if (calendar) {
      setName(calendar.name);
      setOwnerId(calendar.ownerId);
      setMemberIds(calendar.memberIds);
      setColor(calendar.color);
    } else {
      setName("");
      setOwnerId(members[0]?.id || "");
      setMemberIds(members.map((m) => m.id));
      setColor("#ffffff");
    }
  }, [calendar, members]);

  const handleSave = () => {
    if (!name.trim() || !ownerId) return;

    onSave({
      name: name.trim(),
      ownerId,
      memberIds: memberIds.includes(ownerId) ? memberIds : [...memberIds, ownerId],
      color,
    });
  };

  const toggleMember = (memberId: string) => {
    setMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {calendar ? "Edit Calendar" : "New Calendar"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Calendar name"
              className="h-12 bg-input border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Owner</Label>
            <Select value={ownerId} onValueChange={setOwnerId}>
              <SelectTrigger className="h-12 bg-input border-border text-foreground">
                <SelectValue placeholder="Select owner" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id} className="h-11">
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Color</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger className="h-12 bg-input border-border text-foreground">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: color }}
                    />
                    {COLORS.find((c) => c.value === color)?.label}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {COLORS.map((c) => (
                  <SelectItem key={c.value} value={c.value} className="h-11">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: c.value }}
                      />
                      {c.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm text-muted-foreground">Members</Label>
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-input border border-border"
                >
                  <Checkbox
                    checked={memberIds.includes(member.id)}
                    onCheckedChange={() => toggleMember(member.id)}
                    disabled={member.id === ownerId}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: member.color }}
                    />
                    <span className="text-sm text-foreground">{member.name}</span>
                  </div>
                  {member.id === ownerId && (
                    <span className="text-xs text-muted-foreground">Owner</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          {calendar ? (
            <Button
              variant="ghost"
              onClick={() => onDelete(calendar.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!name.trim()}>
              {calendar ? "Save" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
