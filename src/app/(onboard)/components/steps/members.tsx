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
import { Plus, Pencil, Trash2, ArrowLeft, ArrowRight, Users, Heart, Crown, Shield, UserCircle } from "lucide-react"
import { Member, OnboardingData } from "../../onboard-wizzard"
import { CuteBunny, FloatingStars } from "@/components/ui/fun-decorations"

type MembersStepProps = {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

const roleConfig = {
  admin: { label: "Admin", icon: Shield, color: "from-[oklch(0.75_0.14_290)] to-[oklch(0.65_0.16_290)]", bg: "icon-bg-lavender" },
  member: { label: "Member", icon: UserCircle, color: "from-[oklch(0.75_0.14_185)] to-[oklch(0.65_0.16_185)]", bg: "icon-bg-teal" },
  guest: { label: "Guest", icon: Crown, color: "from-[oklch(0.9_0.14_95)] to-[oklch(0.85_0.12_55)]", bg: "icon-bg-sunny" },
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
    <div className="space-y-8 relative">
      {/* Fun decorations */}
      <FloatingStars className="opacity-30" />
      
      {/* Header with cute bunny */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[oklch(0.75_0.14_290)] to-[oklch(0.65_0.16_260)] flex items-center justify-center shadow-lg">
              <Users className="w-10 h-10 text-white" />
            </div>
            <CuteBunny size="sm" className="absolute -right-6 -bottom-2" />
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            Add Your Family
            <Heart className="w-6 h-6 text-[oklch(0.75_0.2_350)] animate-bounce-gentle" />
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Invite the people who make your house a home!
          </p>
        </div>
      </div>

      {/* Members card */}
      <Card className="bg-card border-2 border-border rounded-3xl shadow-lg overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-card to-muted/20 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[oklch(0.75_0.14_290)] to-[oklch(0.65_0.16_260)] flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Family Members</CardTitle>
              <CardDescription className="text-base">
                {data.members.length} {data.members.length === 1 ? "person" : "people"} in your family
              </CardDescription>
            </div>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 px-5 rounded-2xl bg-gradient-to-r from-[oklch(0.75_0.2_350)] to-[oklch(0.7_0.18_290)] hover:opacity-90 shadow-md font-semibold">
                <Plus className="w-5 h-5 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-2 border-border rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  Add Family Member
                  <Heart className="w-5 h-5 text-[oklch(0.75_0.2_350)]" />
                </DialogTitle>
                <DialogDescription className="text-base">
                  Welcome someone new to your family hub!
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-5 py-4">
                <div className="flex justify-center">
                  <Avatar 
                    name={formData.name || "New"} 
                    identifier={formData.email || "new-member"}
                    size="xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-semibold">Name</Label>
                  <Input
                    id="name"
                    placeholder="What should we call them?"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12 rounded-2xl bg-input border-2 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-semibold">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Their email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-12 rounded-2xl bg-input border-2 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="font-semibold">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: Member["role"]) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger className="h-12 rounded-2xl bg-input border-2 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-2 border-border rounded-2xl">
                      {Object.entries(roleConfig).map(([key, config]) => {
                        const Icon = config.icon
                        return (
                          <SelectItem key={key} value={key} className="h-12 rounded-xl">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {config.label}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="gap-3">
                <Button variant="outline" onClick={() => setIsAddOpen(false)} className="h-12 px-6 rounded-2xl bg-transparent border-2">
                  Cancel
                </Button>
                <Button 
                  onClick={handleAdd} 
                  disabled={!formData.name || !formData.email} 
                  className="h-12 px-6 rounded-2xl bg-gradient-to-r from-[oklch(0.75_0.18_145)] to-[oklch(0.7_0.16_185)] hover:opacity-90"
                >
                  Add to Family
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-5">
          <div className="space-y-3">
            {data.members.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <Users className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <p className="text-lg font-medium text-muted-foreground">No family members yet</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Add your first family member above!</p>
              </div>
            ) : (
              data.members.map((member) => {
                const config = roleConfig[member.role]
                const Icon = config.icon
                return (
                  <div 
                    key={member.id} 
                    className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-muted/30 to-transparent border-2 border-border hover:border-[oklch(0.8_0.1_350)] transition-all"
                  >
                    <Avatar 
                      name={member.name} 
                      identifier={member.id}
                      size="lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg text-foreground truncate">{member.name}</span>
                        <Badge className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${config.bg}`}>
                          <Icon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground truncate block">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl hover:bg-[oklch(0.95_0.05_290)]"
                        onClick={() => openEdit(member)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(member.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingMember} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="bg-card border-2 border-border rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Member</DialogTitle>
            <DialogDescription className="text-base">Update their information</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="flex justify-center">
              <Avatar 
                name={formData.name || "?"} 
                identifier={editingMember?.id || "edit"}
                size="xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="font-semibold">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 rounded-2xl bg-input border-2 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email" className="font-semibold">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 rounded-2xl bg-input border-2 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role" className="font-semibold">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: Member["role"]) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger className="h-12 rounded-2xl bg-input border-2 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-2 border-border rounded-2xl">
                  {Object.entries(roleConfig).map(([key, config]) => {
                    const Icon = config.icon
                    return (
                      <SelectItem key={key} value={key} className="h-12 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {config.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={resetForm} className="h-12 px-6 rounded-2xl bg-transparent border-2">
              Cancel
            </Button>
            <Button onClick={handleEdit} className="h-12 px-6 rounded-2xl bg-gradient-to-r from-[oklch(0.75_0.18_145)] to-[oklch(0.7_0.16_185)] hover:opacity-90">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Navigation */}
      <div className="flex justify-between gap-4 pt-4">
        <Button variant="outline" onClick={onBack} className="h-14 px-6 rounded-2xl bg-transparent border-2 font-semibold">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onNext} 
          className="h-14 px-8 rounded-2xl bg-gradient-to-r from-[oklch(0.75_0.2_350)] to-[oklch(0.7_0.18_290)] hover:opacity-90 shadow-lg font-semibold text-lg"
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
