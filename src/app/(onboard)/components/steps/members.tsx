"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Plus, Pencil, Trash2, ArrowLeft, ArrowRight, Users } from "lucide-react"
import { Member, OnboardingData } from "../../onboard-wizzard"

type MembersStepProps = {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

const roleColors = {
  admin: "icon-bg-lavender",
  member: "icon-bg-teal",
  guest: "icon-bg-sunny",
}

export function MembersStep({ data, updateData, onNext, onBack }: MembersStepProps) {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [formData, setFormData] = useState({ name: "", email: "", role: "member" as Member["role"] })

  const resetForm = () => {
    setFormData({ name: "", email: "", role: "member" })
    setEditingMember(null)
  }

  const handleAdd = () => {
    const newMember: Member = {
      id: Date.now().toString(),
      ...formData,
    }
    updateData({ members: [...data.members, newMember] })
    setIsAddOpen(false)
    resetForm()
  }

  const handleEdit = () => {
    if (!editingMember) return
    const updated = data.members.map((m) => (m.id === editingMember.id ? { ...m, ...formData } : m))
    updateData({ members: updated })
    setEditingMember(null)
    resetForm()
  }

  const handleDelete = (id: string) => {
    updateData({ members: data.members.filter((m) => m.id !== id) })
  }

  const openEdit = (member: Member) => {
    setFormData({ name: member.name, email: member.email, role: member.role })
    setEditingMember(member)
  }

  return (
    <div className="space-y-6">
      {/* Header with icon */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl icon-bg-lavender flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Add Your Family</h1>
          <p className="text-muted-foreground">
            Invite family members or guests who can access your smart home hub.
          </p>
        </div>
      </div>

      <Card className="bg-card border-border rounded-2xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">Family Members</CardTitle>
            <CardDescription>{data.members.length} member{data.members.length !== 1 ? "s" : ""} added</CardDescription>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Add Family Member</DialogTitle>
                <DialogDescription>
                  Add a new member to your family hub.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-5 py-4">
                {/* Avatar preview */}
                <div className="flex justify-center">
                  <Avatar 
                    name={formData.name || "New"} 
                    identifier={formData.email || "new-member"}
                    size="xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-medium">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-input border-border rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-input border-border rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="font-medium">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: Member["role"]) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger className="bg-input border-border rounded-xl h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border rounded-xl">
                      <SelectItem value="admin" className="rounded-lg">Admin</SelectItem>
                      <SelectItem value="member" className="rounded-lg">Member</SelectItem>
                      <SelectItem value="guest" className="rounded-lg">Guest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setIsAddOpen(false)} className="bg-transparent rounded-xl">
                  Cancel
                </Button>
                <Button onClick={handleAdd} disabled={!formData.name || !formData.email} className="rounded-xl">
                  Add Member
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.members.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No members added yet. Add your first family member above.
              </div>
            ) : (
              data.members.map((member) => (
                <div key={member.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border card-interactive">
                  <Avatar 
                    name={member.name} 
                    identifier={member.id}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-foreground truncate">{member.name}</span>
                      <Badge variant="outline" className={`text-xs font-semibold ${roleColors[member.role]}`}>
                        {member.role}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground truncate block">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground"
                      onClick={() => openEdit(member)}
                    >
                      <Pencil className="w-4 h-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(member.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingMember} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="bg-card border-border rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Member</DialogTitle>
            <DialogDescription>Update member information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            {/* Avatar preview */}
            <div className="flex justify-center">
              <Avatar 
                name={formData.name || "?"} 
                identifier={editingMember?.id || "edit"}
                size="xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="font-medium">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-input border-border rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email" className="font-medium">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-input border-border rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role" className="font-medium">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: Member["role"]) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger className="bg-input border-border rounded-xl h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border rounded-xl">
                  <SelectItem value="admin" className="rounded-lg">Admin</SelectItem>
                  <SelectItem value="member" className="rounded-lg">Member</SelectItem>
                  <SelectItem value="guest" className="rounded-lg">Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={resetForm} className="bg-transparent rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleEdit} className="rounded-xl">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Navigation */}
      <div className="flex justify-between gap-4">
        <Button variant="outline" onClick={onBack} className="bg-transparent rounded-xl h-12 px-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button onClick={onNext} className="rounded-xl h-12 px-6">
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
