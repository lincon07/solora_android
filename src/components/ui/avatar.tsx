"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const AVATAR_COLORS = [
  "avatar-coral",
  "avatar-teal", 
  "avatar-lavender",
  "avatar-mint",
  "avatar-sunny",
  "avatar-sky",
] as const

type AvatarColor = (typeof AVATAR_COLORS)[number]

// Consistent color based on name/id
function getAvatarColor(identifier: string): AvatarColor {
  let hash = 0
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

// Get initials from name
function getInitials(name: string): string {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

// Fun animal icons for kids
const ANIMAL_ICONS = [
  { name: "bear", icon: "🐻" },
  { name: "bunny", icon: "🐰" },
  { name: "cat", icon: "🐱" },
  { name: "dog", icon: "🐶" },
  { name: "fox", icon: "🦊" },
  { name: "owl", icon: "🦉" },
  { name: "panda", icon: "🐼" },
  { name: "penguin", icon: "🐧" },
  { name: "unicorn", icon: "🦄" },
  { name: "lion", icon: "🦁" },
] as const

type AnimalIcon = (typeof ANIMAL_ICONS)[number]["name"]

interface AvatarProps {
  name?: string
  identifier?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  animalIcon?: AnimalIcon
  showBorder?: boolean
  className?: string
}

const sizeClasses = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-2xl",
}

export function Avatar({
  name = "",
  identifier,
  size = "md",
  animalIcon,
  showBorder = false,
  className,
}: AvatarProps) {
  const colorClass = getAvatarColor(identifier || name)
  const animal = animalIcon ? ANIMAL_ICONS.find((a) => a.name === animalIcon) : null

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold shrink-0 select-none",
        sizeClasses[size],
        colorClass,
        showBorder && "ring-2 ring-background shadow-sm",
        className
      )}
    >
      {animal ? (
        <span className="leading-none">{animal.icon}</span>
      ) : (
        <span className="leading-none">{getInitials(name)}</span>
      )}
    </div>
  )
}

// Avatar group for showing multiple members
interface AvatarGroupProps {
  members: Array<{ name: string; id?: string; animalIcon?: AnimalIcon }>
  max?: number
  size?: AvatarProps["size"]
  className?: string
}

export function AvatarGroup({ members, max = 4, size = "sm", className }: AvatarGroupProps) {
  const visible = members.slice(0, max)
  const remaining = members.length - max

  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {visible.map((member, i) => (
        <Avatar
          key={member.id || i}
          name={member.name}
          identifier={member.id || member.name}
          animalIcon={member.animalIcon}
          size={size}
          showBorder
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            "rounded-full flex items-center justify-center font-medium bg-muted text-muted-foreground ring-2 ring-background",
            sizeClasses[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}

export { AVATAR_COLORS, ANIMAL_ICONS, getAvatarColor, getInitials }
export type { AvatarColor, AnimalIcon }
