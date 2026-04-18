"use client"

import { cn } from "@/lib/utils"

type MascotType = "sunny" | "star" | "cloud" | "heart" | "rainbow" | "house"
type MascotSize = "sm" | "md" | "lg" | "xl"
type MascotMood = "happy" | "excited" | "sleepy" | "thinking"

interface MascotProps {
  type?: MascotType
  size?: MascotSize
  mood?: MascotMood
  className?: string
  animate?: boolean
}

const sizeClasses: Record<MascotSize, string> = {
  sm: "w-12 h-12",
  md: "w-20 h-20",
  lg: "w-28 h-28",
  xl: "w-40 h-40",
}

// Fun cartoon mascots as SVG
export function Mascot({ 
  type = "sunny", 
  size = "md", 
  mood = "happy",
  className,
  animate = true 
}: MascotProps) {
  const animationClass = animate ? "animate-float" : ""
  
  return (
    <div className={cn(sizeClasses[size], animationClass, className)}>
      {type === "sunny" && <SunnyMascot mood={mood} />}
      {type === "star" && <StarMascot mood={mood} />}
      {type === "cloud" && <CloudMascot mood={mood} />}
      {type === "heart" && <HeartMascot mood={mood} />}
      {type === "rainbow" && <RainbowMascot />}
      {type === "house" && <HouseMascot mood={mood} />}
    </div>
  )
}

// Sunny mascot - a happy sun with a face
function SunnyMascot({ mood }: { mood: MascotMood }) {
  const eyes = mood === "sleepy" ? "M30,38 Q32,40 34,38 M46,38 Q48,40 50,38" : 
               mood === "excited" ? "M30,35 L34,35 M46,35 L50,35" :
               "M30,35 A2,2 0 1,1 34,35 A2,2 0 1,1 30,35 M46,35 A2,2 0 1,1 50,35 A2,2 0 1,1 46,35"
  
  const mouth = mood === "happy" ? "M35,48 Q40,55 45,48" :
                mood === "excited" ? "M33,46 Q40,58 47,46" :
                mood === "sleepy" ? "M37,50 Q40,52 43,50" :
                "M35,50 Q40,48 45,50"

  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full drop-shadow-lg">
      {/* Sun rays */}
      <g className="animate-spin" style={{ animationDuration: '20s', transformOrigin: '40px 40px' }}>
        {[...Array(8)].map((_, i) => (
          <path
            key={i}
            d={`M40,${8} L36,${18} L44,${18} Z`}
            fill="oklch(0.9000 0.1600 95)"
            transform={`rotate(${i * 45} 40 40)`}
          />
        ))}
      </g>
      {/* Sun body */}
      <circle cx="40" cy="40" r="22" fill="oklch(0.9200 0.1400 95)" />
      <circle cx="40" cy="40" r="18" fill="oklch(0.9500 0.1200 95)" />
      {/* Blush */}
      <circle cx="26" cy="44" r="4" fill="oklch(0.8500 0.1200 25)" opacity="0.5" />
      <circle cx="54" cy="44" r="4" fill="oklch(0.8500 0.1200 25)" opacity="0.5" />
      {/* Eyes */}
      <path d={eyes} fill="oklch(0.3000 0.0400 260)" />
      {/* Mouth */}
      <path d={mouth} stroke="oklch(0.3000 0.0400 260)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// Star mascot - a cute star with a face
function StarMascot({ mood }: { mood: MascotMood }) {
  const eyes = mood === "sleepy" ? "M32,35 Q34,37 36,35 M44,35 Q46,37 48,35" : 
               mood === "excited" ? "M32,33 L36,33 M44,33 L48,33" :
               "M32,33 A2,2 0 1,1 36,33 A2,2 0 1,1 32,33 M44,33 A2,2 0 1,1 48,33 A2,2 0 1,1 44,33"

  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full drop-shadow-lg">
      {/* Star body */}
      <path 
        d="M40,8 L46,28 L68,28 L50,42 L58,64 L40,50 L22,64 L30,42 L12,28 L34,28 Z" 
        fill="oklch(0.8800 0.1600 95)"
      />
      <path 
        d="M40,14 L44,28 L60,28 L48,40 L54,56 L40,46 L26,56 L32,40 L20,28 L36,28 Z" 
        fill="oklch(0.9200 0.1400 95)"
      />
      {/* Eyes */}
      <path d={eyes} fill="oklch(0.3000 0.0400 260)" />
      {/* Mouth */}
      <path d="M36,42 Q40,48 44,42" stroke="oklch(0.3000 0.0400 260)" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Sparkle */}
      <circle cx="58" cy="18" r="3" fill="white" className="animate-sparkle" />
    </svg>
  )
}

// Cloud mascot - a fluffy cloud with a face
function CloudMascot({ mood }: { mood: MascotMood }) {
  const eyes = mood === "sleepy" ? "M28,38 Q30,40 32,38 M48,38 Q50,40 52,38" : 
               "M28,36 A2,2 0 1,1 32,36 A2,2 0 1,1 28,36 M48,36 A2,2 0 1,1 52,36 A2,2 0 1,1 48,36"

  return (
    <svg viewBox="0 0 80 60" fill="none" className="w-full h-full drop-shadow-lg">
      {/* Cloud body */}
      <ellipse cx="40" cy="38" rx="28" ry="18" fill="white" />
      <circle cx="22" cy="35" r="14" fill="white" />
      <circle cx="58" cy="35" r="14" fill="white" />
      <circle cx="32" cy="26" r="12" fill="white" />
      <circle cx="50" cy="28" r="10" fill="white" />
      {/* Eyes */}
      <path d={eyes} fill="oklch(0.3000 0.0400 260)" />
      {/* Mouth */}
      <path d="M35,46 Q40,52 45,46" stroke="oklch(0.3000 0.0400 260)" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Blush */}
      <circle cx="24" cy="42" r="4" fill="oklch(0.8500 0.1200 350)" opacity="0.4" />
      <circle cx="56" cy="42" r="4" fill="oklch(0.8500 0.1200 350)" opacity="0.4" />
    </svg>
  )
}

// Heart mascot - a cute heart with a face
function HeartMascot({ mood }: { mood: MascotMood }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full drop-shadow-lg">
      {/* Heart body */}
      <path 
        d="M40,70 C20,50 8,35 8,24 C8,14 16,6 26,6 C32,6 37,9 40,14 C43,9 48,6 54,6 C64,6 72,14 72,24 C72,35 60,50 40,70 Z" 
        fill="oklch(0.7500 0.2000 350)"
      />
      <path 
        d="M40,64 C24,48 14,36 14,26 C14,18 20,12 28,12 C33,12 37,15 40,19 C43,15 47,12 52,12 C60,12 66,18 66,26 C66,36 56,48 40,64 Z" 
        fill="oklch(0.8000 0.1800 350)"
      />
      {/* Eyes */}
      <circle cx="30" cy="32" r="3" fill="oklch(0.2500 0.0400 260)" />
      <circle cx="50" cy="32" r="3" fill="oklch(0.2500 0.0400 260)" />
      <circle cx="31" cy="31" r="1" fill="white" />
      <circle cx="51" cy="31" r="1" fill="white" />
      {/* Mouth */}
      <path d="M35,42 Q40,50 45,42" stroke="oklch(0.2500 0.0400 260)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// Rainbow mascot - a cute rainbow arc
function RainbowMascot() {
  return (
    <svg viewBox="0 0 80 50" fill="none" className="w-full h-full drop-shadow-lg">
      {/* Rainbow arcs */}
      <path d="M8,50 A32,32 0 0,1 72,50" stroke="oklch(0.7500 0.2000 350)" strokeWidth="6" fill="none" />
      <path d="M14,50 A26,26 0 0,1 66,50" stroke="oklch(0.8000 0.1800 55)" strokeWidth="6" fill="none" />
      <path d="M20,50 A20,20 0 0,1 60,50" stroke="oklch(0.9000 0.1600 95)" strokeWidth="6" fill="none" />
      <path d="M26,50 A14,14 0 0,1 54,50" stroke="oklch(0.7500 0.1800 145)" strokeWidth="6" fill="none" />
      <path d="M32,50 A8,8 0 0,1 48,50" stroke="oklch(0.7000 0.1600 240)" strokeWidth="6" fill="none" />
      {/* Clouds at ends */}
      <circle cx="10" cy="48" r="8" fill="white" />
      <circle cx="4" cy="46" r="6" fill="white" />
      <circle cx="70" cy="48" r="8" fill="white" />
      <circle cx="76" cy="46" r="6" fill="white" />
    </svg>
  )
}

// House mascot - a cute house with a face
function HouseMascot({ mood }: { mood: MascotMood }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full drop-shadow-lg">
      {/* House body */}
      <rect x="16" y="38" width="48" height="36" rx="4" fill="oklch(0.8000 0.1800 55)" />
      {/* Roof */}
      <path d="M8,42 L40,14 L72,42 Z" fill="oklch(0.7000 0.2000 350)" />
      <path d="M14,40 L40,18 L66,40 Z" fill="oklch(0.7500 0.1800 350)" />
      {/* Door */}
      <rect x="34" y="52" width="12" height="22" rx="2" fill="oklch(0.5000 0.1600 55)" />
      <circle cx="42" cy="64" r="2" fill="oklch(0.9000 0.1600 95)" />
      {/* Windows (eyes) */}
      <rect x="22" y="46" width="10" height="10" rx="2" fill="oklch(0.8500 0.1400 220)" />
      <rect x="48" y="46" width="10" height="10" rx="2" fill="oklch(0.8500 0.1400 220)" />
      {/* Eye shine */}
      <rect x="24" y="48" width="3" height="3" rx="1" fill="white" />
      <rect x="50" y="48" width="3" height="3" rx="1" fill="white" />
      {/* Chimney */}
      <rect x="54" y="20" width="8" height="16" rx="2" fill="oklch(0.6500 0.1800 25)" />
      {/* Smoke */}
      <circle cx="58" cy="14" r="3" fill="oklch(0.9000 0.0200 220)" className="animate-float" />
      <circle cx="62" cy="8" r="2" fill="oklch(0.9200 0.0200 220)" className="animate-float" style={{ animationDelay: '0.5s' }} />
    </svg>
  )
}

// Decorative floating shapes for backgrounds
export function FloatingShapes({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {/* Stars */}
      <div className="absolute top-[10%] left-[5%] animate-float" style={{ animationDelay: '0s' }}>
        <Mascot type="star" size="sm" animate={false} />
      </div>
      <div className="absolute top-[20%] right-[10%] animate-float" style={{ animationDelay: '1s' }}>
        <Mascot type="star" size="sm" animate={false} />
      </div>
      {/* Clouds */}
      <div className="absolute top-[5%] left-[30%] animate-float opacity-60" style={{ animationDelay: '0.5s' }}>
        <Mascot type="cloud" size="md" animate={false} />
      </div>
      <div className="absolute top-[15%] right-[25%] animate-float opacity-50" style={{ animationDelay: '1.5s' }}>
        <Mascot type="cloud" size="sm" animate={false} />
      </div>
      {/* Hearts */}
      <div className="absolute bottom-[20%] left-[8%] animate-float" style={{ animationDelay: '2s' }}>
        <Mascot type="heart" size="sm" animate={false} />
      </div>
      <div className="absolute bottom-[30%] right-[5%] animate-float" style={{ animationDelay: '0.8s' }}>
        <Mascot type="heart" size="sm" animate={false} />
      </div>
    </div>
  )
}

// Fun decorative banner with rainbow colors
export function RainbowBanner({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "relative py-4 px-6 rounded-2xl overflow-hidden",
      "bg-gradient-to-r from-[oklch(0.8500_0.1200_350)] via-[oklch(0.9000_0.1200_95)] to-[oklch(0.8000_0.1200_185)]",
      className
    )}>
      <div className="relative z-10 text-white font-bold text-center">
        {children}
      </div>
    </div>
  )
}
