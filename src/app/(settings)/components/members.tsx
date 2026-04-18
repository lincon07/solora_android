"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Pencil, Trash2, Shield, Crown, Users } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar } from "@/components/ui/avatar"

import {
  deleteHubMember,
  fetchHubMembers,
  updateHubMember,
  type HubMember,
  type HubMemberRole,
} from "@/api/members"
import { fetchHubMe } from "@/api/hub"
import { AddMemberWizard } from "./add-member-wizzard"

const roleUi: Record<HubMemberRole, { label: string; icon: any; colorClass: string }> = {
  owner: { label: "Owner", icon: Crown, colorClass: "bg-primary/15 text-primary" },
  admin: { label: "Admin", icon: Shield, colorClass: "icon-bg-lavender" },
  member: { label: "Member", icon: Users, colorClass: "icon-bg-teal" },
}

export function MembersSection() {
  const [hubId, setHubId] = useState<string | null>(null)

  const [members, setMembers] = useState<HubMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [addOpen, setAddOpen] = useState(false)

  // edit
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<HubMember | null>(null)
  const [formName, setFormName] = useState("")
  const [formRole, setFormRole] = useState<HubMemberRole>("member")

  // delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      const me = await fetchHubMe()
      if (!me?.hub?.id) {
        setHubId(null)
        setMembers([])
        setLoading(false)
        return
      }

      setHubId(me.hub.id)
      const data = await fetchHubMembers(me.hub.id)
      setMembers(data.members)
    } catch (e: any) {
      setError(e?.message ?? "Failed to load members")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const count = useMemo(() => members.length, [members])

  function openEdit(member: HubMember) {
    setEditing(member)
    setFormName(member.displayName ?? "")
    setFormRole((member.role as HubMemberRole) ?? "member")
    setEditOpen(true)
  }

  async function saveEdit() {
    if (!hubId || !editing) return
    await updateHubMember(hubId, editing.id, {
      displayName: formName.trim(),
      role: formRole,
    })
    setEditOpen(false)
    setEditing(null)
    await refresh()
  }

  async function removeMember(memberId: string) {
    if (!hubId) return
    await deleteHubMember(hubId, memberId)
    setDeleteConfirm(null)
    await refresh()
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl icon-bg-lavender flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Family Members</h2>
            <p className="text-sm text-muted-foreground">
              {hubId ? `${count} member${count !== 1 ? "s" : ""} in your hub` : "Hub not paired"}
            </p>
          </div>
        </div>

        <Button onClick={() => setAddOpen(true)} className="h-11 px-5 rounded-xl shadow-sm" disabled={!hubId}>
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading members…
        </div>
      )}

      {error && (
        <div className="text-sm text-destructive">
          {error}
        </div>
      )}

      {!loading && hubId && (
        <div className="grid gap-3">
          {members.map((member) => {
            const ui = roleUi[member.role as HubMemberRole] ?? roleUi.member
            const Icon = ui.icon

            return (
              <div key={member.id} className="rounded-2xl bg-card border border-border p-4 shadow-sm card-interactive">
                <div className="flex items-center gap-4">
                  {/* Colorful avatar */}
                  <Avatar 
                    name={member.displayName ?? "?"} 
                    identifier={member.id}
                    size="lg"
                    showBorder
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-semibold text-foreground truncate">
                        {member.displayName}
                      </span>

                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${ui.colorClass}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {ui.label}
                      </span>
                    </div>

                    <span className="text-xs text-muted-foreground">
                      Member ID: {member.userId.slice(0, 8)}...
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 rounded-xl hover:bg-muted" 
                      onClick={() => openEdit(member)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    {member.role !== "owner" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteConfirm(member.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {deleteConfirm === member.id && (
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-medium">Remove this family member?</span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="rounded-lg" onClick={() => setDeleteConfirm(null)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" size="sm" className="rounded-lg" onClick={() => removeMember(member.id)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Add member wizard */}
      {hubId && (
        <AddMemberWizard
          open={addOpen}
          onOpenChange={setAddOpen}
          hubId={hubId}
          onCreated={refresh}
        />
      )}

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-card border-border max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Family Member</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-3">
            {/* Avatar preview */}
            {editing && (
              <div className="flex justify-center">
                <Avatar 
                  name={formName || editing.displayName || "?"} 
                  identifier={editing.id}
                  size="xl"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Display name</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="h-12 text-base bg-input border-border rounded-xl"
                placeholder="Enter name..."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Role</Label>
              <Select value={formRole} onValueChange={(v) => setFormRole(v as HubMemberRole)}>
                <SelectTrigger className="h-12 text-base bg-input border-border rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border rounded-xl">
                  <SelectItem value="admin" className="h-11 rounded-lg">Admin</SelectItem>
                  <SelectItem value="member" className="h-11 rounded-lg">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {editing?.role === "owner" && (
              <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                Owner role cannot be changed here.
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)} className="flex-1 h-12 rounded-xl">
              Cancel
            </Button>
            <Button onClick={saveEdit} className="flex-1 h-12 rounded-xl" disabled={!formName.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
