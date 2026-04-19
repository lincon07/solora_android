"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Skin tone options
const SKIN_TONES = [
  { id: "light", color: "#FFD5B8" },
  { id: "fair", color: "#F5C9A6" },
  { id: "medium", color: "#E0A775" },
  { id: "tan", color: "#C68642" },
  { id: "brown", color: "#8D5524" },
  { id: "dark", color: "#5C3317" },
] as const

// Hair styles
const HAIR_STYLES = [
  "short", "curly", "long", "spiky", "bald", "ponytail", "bob", "afro"
] as const

// Hair colors
const HAIR_COLORS = [
  { id: "black", color: "#1a1a2e" },
  { id: "brown", color: "#6B4423" },
  { id: "blonde", color: "#F4D03F" },
  { id: "red", color: "#C0392B" },
  { id: "gray", color: "#95A5A6" },
  { id: "blue", color: "#3498DB" },
  { id: "pink", color: "#E91E8C" },
  { id: "purple", color: "#9B59B6" },
] as const

// Outfit colors
const OUTFIT_COLORS = [
  { id: "red", color: "#E74C3C" },
  { id: "blue", color: "#3498DB" },
  { id: "green", color: "#27AE60" },
  { id: "yellow", color: "#F1C40F" },
  { id: "purple", color: "#9B59B6" },
  { id: "pink", color: "#E91E8C" },
  { id: "orange", color: "#E67E22" },
  { id: "teal", color: "#1ABC9C" },
] as const

// Accessories
const ACCESSORIES = [
  "none", "glasses", "sunglasses", "hat", "headband", "bow", "crown", "earrings"
] as const

// Expression
const EXPRESSIONS = [
  "happy", "excited", "cool", "sleepy", "surprised", "silly"
] as const

export type SkinTone = (typeof SKIN_TONES)[number]["id"]
export type HairStyle = (typeof HAIR_STYLES)[number]
export type HairColor = (typeof HAIR_COLORS)[number]["id"]
export type OutfitColor = (typeof OUTFIT_COLORS)[number]["id"]
export type Accessory = (typeof ACCESSORIES)[number]
export type Expression = (typeof EXPRESSIONS)[number]

export interface CartoonAvatarConfig {
  skinTone?: SkinTone
  hairStyle?: HairStyle
  hairColor?: HairColor
  outfitColor?: OutfitColor
  accessory?: Accessory
  expression?: Expression
}

interface CartoonAvatarProps {
  config?: CartoonAvatarConfig
  name?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
  className?: string
  showBorder?: boolean
}

const sizeClasses = {
  xs: "w-8 h-12",
  sm: "w-10 h-14",
  md: "w-14 h-20",
  lg: "w-20 h-28",
  xl: "w-28 h-40",
  "2xl": "w-40 h-56",
}

// Generate consistent config from name/id
function generateConfigFromName(name: string): CartoonAvatarConfig {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return {
    skinTone: SKIN_TONES[Math.abs(hash) % SKIN_TONES.length].id,
    hairStyle: HAIR_STYLES[Math.abs(hash >> 3) % HAIR_STYLES.length],
    hairColor: HAIR_COLORS[Math.abs(hash >> 6) % HAIR_COLORS.length].id,
    outfitColor: OUTFIT_COLORS[Math.abs(hash >> 9) % OUTFIT_COLORS.length].id,
    accessory: ACCESSORIES[Math.abs(hash >> 12) % ACCESSORIES.length],
    expression: EXPRESSIONS[Math.abs(hash >> 15) % EXPRESSIONS.length],
  }
}

function getSkinColor(tone: SkinTone): string {
  return SKIN_TONES.find(t => t.id === tone)?.color ?? SKIN_TONES[0].color
}

function getHairColor(color: HairColor): string {
  return HAIR_COLORS.find(c => c.id === color)?.color ?? HAIR_COLORS[0].color
}

function getOutfitColor(color: OutfitColor): string {
  return OUTFIT_COLORS.find(c => c.id === color)?.color ?? OUTFIT_COLORS[0].color
}

// Cartoon character SVG with big head, small body
function CartoonCharacterSVG({ 
  config,
  className 
}: { 
  config: Required<CartoonAvatarConfig>
  className?: string 
}) {
  const skinColor = getSkinColor(config.skinTone)
  const hairColor = getHairColor(config.hairColor)
  const outfitColor = getOutfitColor(config.outfitColor)
  
  // Slightly darker shade for shadows
  const skinShadow = skinColor + "CC"
  const outfitShadow = outfitColor + "BB"

  // Expression elements
  const getEyes = () => {
    switch (config.expression) {
      case "excited":
        return (
          <>
            <ellipse cx="35" cy="38" rx="6" ry="7" fill="#1a1a2e" />
            <ellipse cx="65" cy="38" rx="6" ry="7" fill="#1a1a2e" />
            <circle cx="37" cy="36" r="2" fill="white" />
            <circle cx="67" cy="36" r="2" fill="white" />
          </>
        )
      case "cool":
        return (
          <>
            <ellipse cx="35" cy="40" rx="7" ry="3" fill="#1a1a2e" />
            <ellipse cx="65" cy="40" rx="7" ry="3" fill="#1a1a2e" />
          </>
        )
      case "sleepy":
        return (
          <>
            <path d="M28 40 Q35 36 42 40" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M58 40 Q65 36 72 40" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        )
      case "surprised":
        return (
          <>
            <circle cx="35" cy="38" r="8" fill="#1a1a2e" />
            <circle cx="65" cy="38" r="8" fill="#1a1a2e" />
            <circle cx="36" cy="36" r="3" fill="white" />
            <circle cx="66" cy="36" r="3" fill="white" />
          </>
        )
      case "silly":
        return (
          <>
            <ellipse cx="35" cy="38" rx="5" ry="6" fill="#1a1a2e" />
            <ellipse cx="65" cy="40" rx="5" ry="6" fill="#1a1a2e" />
            <circle cx="37" cy="36" r="2" fill="white" />
            <circle cx="67" cy="38" r="2" fill="white" />
          </>
        )
      default: // happy
        return (
          <>
            <ellipse cx="35" cy="38" rx="5" ry="6" fill="#1a1a2e" />
            <ellipse cx="65" cy="38" rx="5" ry="6" fill="#1a1a2e" />
            <circle cx="36" cy="36" r="2" fill="white" />
            <circle cx="66" cy="36" r="2" fill="white" />
          </>
        )
    }
  }

  const getMouth = () => {
    switch (config.expression) {
      case "excited":
        return <ellipse cx="50" cy="56" rx="10" ry="8" fill="#1a1a2e" />
      case "cool":
        return <path d="M40 54 Q50 58 60 54" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
      case "sleepy":
        return <ellipse cx="50" cy="56" rx="6" ry="4" fill="#1a1a2e" />
      case "surprised":
        return <ellipse cx="50" cy="58" rx="8" ry="10" fill="#1a1a2e" />
      case "silly":
        return (
          <>
            <path d="M38 52 Q50 65 62 52" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
            <ellipse cx="55" cy="58" rx="4" ry="2" fill="#E91E8C" />
          </>
        )
      default: // happy
        return <path d="M38 52 Q50 62 62 52" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
    }
  }

  const getHair = () => {
    switch (config.hairStyle) {
      case "short":
        return (
          <path 
            d="M25 35 Q25 10 50 8 Q75 10 75 35 Q75 20 50 18 Q25 20 25 35" 
            fill={hairColor}
          />
        )
      case "curly":
        return (
          <>
            <circle cx="30" cy="18" r="10" fill={hairColor} />
            <circle cx="45" cy="12" r="10" fill={hairColor} />
            <circle cx="60" cy="12" r="10" fill={hairColor} />
            <circle cx="72" cy="18" r="10" fill={hairColor} />
            <circle cx="22" cy="30" r="8" fill={hairColor} />
            <circle cx="78" cy="30" r="8" fill={hairColor} />
          </>
        )
      case "long":
        return (
          <>
            <path d="M20 35 Q18 10 50 5 Q82 10 80 35 L80 70 Q80 75 75 75 L75 45 Q75 20 50 18 Q25 20 25 45 L25 75 Q20 75 20 70 Z" fill={hairColor} />
          </>
        )
      case "spiky":
        return (
          <>
            <polygon points="50,0 45,20 55,20" fill={hairColor} />
            <polygon points="35,5 33,22 43,22" fill={hairColor} />
            <polygon points="65,5 57,22 67,22" fill={hairColor} />
            <polygon points="22,15 25,30 35,25" fill={hairColor} />
            <polygon points="78,15 65,25 75,30" fill={hairColor} />
            <path d="M25 35 Q25 18 50 15 Q75 18 75 35" fill={hairColor} />
          </>
        )
      case "ponytail":
        return (
          <>
            <path d="M25 35 Q25 15 50 12 Q75 15 75 35" fill={hairColor} />
            <ellipse cx="75" cy="25" rx="8" ry="15" fill={hairColor} />
            <ellipse cx="82" cy="45" rx="6" ry="20" fill={hairColor} />
          </>
        )
      case "bob":
        return (
          <path 
            d="M18 35 Q15 10 50 5 Q85 10 82 35 L82 55 Q82 60 78 58 L78 40 Q78 20 50 18 Q22 20 22 40 L22 58 Q18 60 18 55 Z" 
            fill={hairColor}
          />
        )
      case "afro":
        return (
          <ellipse cx="50" cy="25" rx="38" ry="30" fill={hairColor} />
        )
      case "bald":
      default:
        return null
    }
  }

  const getAccessory = () => {
    switch (config.accessory) {
      case "glasses":
        return (
          <>
            <rect x="24" y="32" width="18" height="14" rx="3" fill="none" stroke="#1a1a2e" strokeWidth="2" />
            <rect x="58" y="32" width="18" height="14" rx="3" fill="none" stroke="#1a1a2e" strokeWidth="2" />
            <line x1="42" y1="38" x2="58" y2="38" stroke="#1a1a2e" strokeWidth="2" />
          </>
        )
      case "sunglasses":
        return (
          <>
            <rect x="22" y="32" width="20" height="14" rx="3" fill="#1a1a2e" />
            <rect x="58" y="32" width="20" height="14" rx="3" fill="#1a1a2e" />
            <line x1="42" y1="38" x2="58" y2="38" stroke="#1a1a2e" strokeWidth="3" />
          </>
        )
      case "hat":
        return (
          <>
            <ellipse cx="50" cy="12" rx="35" ry="5" fill="#E74C3C" />
            <path d="M25 12 Q25 -5 50 -8 Q75 -5 75 12" fill="#E74C3C" />
          </>
        )
      case "headband":
        return (
          <rect x="20" y="20" width="60" height="6" rx="3" fill="#E91E8C" />
        )
      case "bow":
        return (
          <>
            <circle cx="75" cy="20" r="6" fill="#E91E8C" />
            <ellipse cx="68" cy="20" rx="8" ry="5" fill="#E91E8C" />
            <ellipse cx="82" cy="20" rx="8" ry="5" fill="#E91E8C" />
          </>
        )
      case "crown":
        return (
          <path d="M30 15 L35 5 L42 12 L50 0 L58 12 L65 5 L70 15 Z" fill="#F1C40F" stroke="#E67E22" strokeWidth="1" />
        )
      case "earrings":
        return (
          <>
            <circle cx="18" cy="50" r="4" fill="#F1C40F" />
            <circle cx="82" cy="50" r="4" fill="#F1C40F" />
          </>
        )
      default:
        return null
    }
  }

  return (
    <svg viewBox="0 0 100 140" className={className}>
      {/* Body (small) */}
      <path 
        d="M35 95 Q35 85 50 82 Q65 85 65 95 L68 130 Q68 138 60 138 L40 138 Q32 138 32 130 Z" 
        fill={outfitColor}
      />
      {/* Body shadow */}
      <path 
        d="M40 95 Q40 88 50 85 Q55 88 55 95 L56 120 L44 120 Z" 
        fill={outfitShadow}
        opacity="0.3"
      />
      
      {/* Arms */}
      <ellipse cx="28" cy="105" rx="8" ry="12" fill={outfitColor} />
      <ellipse cx="72" cy="105" rx="8" ry="12" fill={outfitColor} />
      
      {/* Hands */}
      <circle cx="28" cy="118" r="6" fill={skinColor} />
      <circle cx="72" cy="118" r="6" fill={skinColor} />
      
      {/* Legs */}
      <ellipse cx="42" cy="138" rx="6" ry="4" fill="#1a1a2e" />
      <ellipse cx="58" cy="138" rx="6" ry="4" fill="#1a1a2e" />
      
      {/* Neck */}
      <rect x="44" y="70" width="12" height="15" fill={skinColor} />
      
      {/* Head (big) */}
      <ellipse cx="50" cy="42" rx="32" ry="35" fill={skinColor} />
      
      {/* Face shadow */}
      <ellipse cx="50" cy="50" rx="28" ry="25" fill={skinShadow} opacity="0.15" />
      
      {/* Cheeks (blush) */}
      <ellipse cx="25" cy="50" rx="6" ry="4" fill="#FFB6C1" opacity="0.5" />
      <ellipse cx="75" cy="50" rx="6" ry="4" fill="#FFB6C1" opacity="0.5" />
      
      {/* Ears */}
      <ellipse cx="18" cy="45" rx="5" ry="8" fill={skinColor} />
      <ellipse cx="82" cy="45" rx="5" ry="8" fill={skinColor} />
      
      {/* Hair (behind accessories) */}
      {getHair()}
      
      {/* Eyes */}
      {getEyes()}
      
      {/* Eyebrows */}
      <path d="M28 30 Q35 27 42 30" stroke="#1a1a2e" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M58 30 Q65 27 72 30" stroke="#1a1a2e" strokeWidth="2" fill="none" strokeLinecap="round" />
      
      {/* Nose */}
      <ellipse cx="50" cy="48" rx="3" ry="2" fill={skinShadow} opacity="0.4" />
      
      {/* Mouth */}
      {getMouth()}
      
      {/* Accessory (on top) */}
      {getAccessory()}
    </svg>
  )
}

export function CartoonAvatar({
  config,
  name = "",
  size = "md",
  className,
  showBorder = false,
}: CartoonAvatarProps) {
  // Generate config from name if not provided
  const finalConfig = React.useMemo(() => {
    const generated = name ? generateConfigFromName(name) : {}
    return {
      skinTone: config?.skinTone ?? generated.skinTone ?? "fair",
      hairStyle: config?.hairStyle ?? generated.hairStyle ?? "short",
      hairColor: config?.hairColor ?? generated.hairColor ?? "brown",
      outfitColor: config?.outfitColor ?? generated.outfitColor ?? "blue",
      accessory: config?.accessory ?? generated.accessory ?? "none",
      expression: config?.expression ?? generated.expression ?? "happy",
    } as Required<CartoonAvatarConfig>
  }, [config, name])

  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 select-none overflow-hidden",
        sizeClasses[size],
        showBorder && "ring-2 ring-background shadow-md",
        className
      )}
    >
      <CartoonCharacterSVG config={finalConfig} className="w-full h-full" />
    </div>
  )
}

// Avatar group for showing multiple cartoon members
interface CartoonAvatarGroupProps {
  members: Array<{ name: string; id?: string; config?: CartoonAvatarConfig }>
  max?: number
  size?: CartoonAvatarProps["size"]
  className?: string
}

export function CartoonAvatarGroup({ 
  members, 
  max = 4, 
  size = "sm", 
  className 
}: CartoonAvatarGroupProps) {
  const visible = members.slice(0, max)
  const remaining = members.length - max

  return (
    <div className={cn("flex items-end -space-x-4", className)}>
      {visible.map((member, i) => (
        <CartoonAvatar
          key={member.id || i}
          name={member.name}
          config={member.config}
          size={size}
          showBorder
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            "rounded-full flex items-center justify-center font-bold bg-muted text-muted-foreground ring-2 ring-background z-10",
            size === "xs" && "w-6 h-6 text-xs",
            size === "sm" && "w-8 h-8 text-sm",
            size === "md" && "w-10 h-10 text-base",
            size === "lg" && "w-12 h-12 text-lg",
            size === "xl" && "w-14 h-14 text-xl",
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}

// Export config options for customization UI
export { SKIN_TONES, HAIR_STYLES, HAIR_COLORS, OUTFIT_COLORS, ACCESSORIES, EXPRESSIONS }
