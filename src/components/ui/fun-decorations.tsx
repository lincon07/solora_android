"use client"

import { cn } from "@/lib/utils"

// Animated floating elements for backgrounds
export function FloatingStars({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {/* Large yellow star */}
      <svg className="absolute top-[10%] left-[15%] w-8 h-8 animate-float" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L14.5 9H22L16 14L18.5 22L12 17L5.5 22L8 14L2 9H9.5L12 2Z" fill="oklch(0.9 0.16 95)" />
      </svg>
      {/* Small pink star */}
      <svg className="absolute top-[25%] right-[20%] w-5 h-5 animate-sparkle" viewBox="0 0 24 24" fill="none" style={{ animationDelay: "0.5s" }}>
        <path d="M12 2L14.5 9H22L16 14L18.5 22L12 17L5.5 22L8 14L2 9H9.5L12 2Z" fill="oklch(0.75 0.2 350)" />
      </svg>
      {/* Medium teal star */}
      <svg className="absolute bottom-[30%] left-[10%] w-6 h-6 animate-bounce-gentle" viewBox="0 0 24 24" fill="none" style={{ animationDelay: "1s" }}>
        <path d="M12 2L14.5 9H22L16 14L18.5 22L12 17L5.5 22L8 14L2 9H9.5L12 2Z" fill="oklch(0.75 0.14 185)" />
      </svg>
      {/* Tiny purple star */}
      <svg className="absolute bottom-[15%] right-[25%] w-4 h-4 animate-float" viewBox="0 0 24 24" fill="none" style={{ animationDelay: "1.5s" }}>
        <path d="M12 2L14.5 9H22L16 14L18.5 22L12 17L5.5 22L8 14L2 9H9.5L12 2Z" fill="oklch(0.7 0.18 290)" />
      </svg>
    </div>
  )
}

export function FloatingClouds({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {/* Big fluffy cloud */}
      <svg className="absolute top-[8%] left-[5%] w-32 h-20 animate-float opacity-60" viewBox="0 0 120 60" fill="none">
        <ellipse cx="30" cy="40" rx="25" ry="18" fill="white" />
        <ellipse cx="55" cy="35" rx="30" ry="22" fill="white" />
        <ellipse cx="85" cy="40" rx="25" ry="18" fill="white" />
        <ellipse cx="45" cy="25" rx="20" ry="15" fill="white" />
        <ellipse cx="70" cy="25" rx="18" ry="14" fill="white" />
      </svg>
      {/* Small cloud right */}
      <svg className="absolute top-[15%] right-[10%] w-20 h-12 animate-float opacity-50" viewBox="0 0 80 40" fill="none" style={{ animationDelay: "2s" }}>
        <ellipse cx="20" cy="25" rx="16" ry="12" fill="white" />
        <ellipse cx="40" cy="22" rx="20" ry="15" fill="white" />
        <ellipse cx="58" cy="25" rx="16" ry="12" fill="white" />
      </svg>
    </div>
  )
}

export function SunnyCorner({ className }: { className?: string }) {
  return (
    <div className={cn("absolute -top-8 -right-8 pointer-events-none", className)}>
      {/* Cute smiling sun */}
      <svg className="w-32 h-32 animate-wiggle" viewBox="0 0 100 100" fill="none">
        {/* Rays */}
        <g className="origin-center">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <rect
              key={i}
              x="48"
              y="5"
              width="4"
              height="15"
              rx="2"
              fill="oklch(0.88 0.16 85)"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
        </g>
        {/* Sun face */}
        <circle cx="50" cy="50" r="28" fill="oklch(0.92 0.14 95)" />
        {/* Rosy cheeks */}
        <circle cx="38" cy="55" r="4" fill="oklch(0.85 0.12 25)" opacity="0.6" />
        <circle cx="62" cy="55" r="4" fill="oklch(0.85 0.12 25)" opacity="0.6" />
        {/* Happy eyes */}
        <ellipse cx="40" cy="46" rx="3" ry="4" fill="oklch(0.3 0.05 260)" />
        <ellipse cx="60" cy="46" rx="3" ry="4" fill="oklch(0.3 0.05 260)" />
        <circle cx="41" cy="45" r="1" fill="white" />
        <circle cx="61" cy="45" r="1" fill="white" />
        {/* Cute smile */}
        <path d="M42 56 Q50 64 58 56" stroke="oklch(0.3 0.05 260)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  )
}

export function RainbowArc({ className }: { className?: string }) {
  return (
    <div className={cn("absolute bottom-0 left-0 w-full h-24 pointer-events-none overflow-hidden", className)}>
      <svg className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-30" viewBox="0 0 600 300" fill="none">
        <path d="M0 300 A300 300 0 0 1 600 300" stroke="oklch(0.75 0.2 350)" strokeWidth="20" fill="none" />
        <path d="M20 300 A280 280 0 0 1 580 300" stroke="oklch(0.78 0.18 55)" strokeWidth="20" fill="none" />
        <path d="M40 300 A260 260 0 0 1 560 300" stroke="oklch(0.9 0.16 95)" strokeWidth="20" fill="none" />
        <path d="M60 300 A240 240 0 0 1 540 300" stroke="oklch(0.75 0.18 145)" strokeWidth="20" fill="none" />
        <path d="M80 300 A220 220 0 0 1 520 300" stroke="oklch(0.7 0.16 240)" strokeWidth="20" fill="none" />
        <path d="M100 300 A200 200 0 0 1 500 300" stroke="oklch(0.7 0.18 290)" strokeWidth="20" fill="none" />
      </svg>
    </div>
  )
}

export function CuteBunny({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "sm" ? "w-12 h-12" : size === "lg" ? "w-24 h-24" : "w-16 h-16"
  return (
    <svg className={cn(sizeClass, "animate-bounce-gentle", className)} viewBox="0 0 60 60" fill="none">
      {/* Ears */}
      <ellipse cx="22" cy="12" rx="6" ry="14" fill="oklch(0.92 0.06 350)" />
      <ellipse cx="38" cy="12" rx="6" ry="14" fill="oklch(0.92 0.06 350)" />
      <ellipse cx="22" cy="14" rx="3" ry="10" fill="oklch(0.85 0.1 350)" />
      <ellipse cx="38" cy="14" rx="3" ry="10" fill="oklch(0.85 0.1 350)" />
      {/* Head */}
      <circle cx="30" cy="35" r="20" fill="oklch(0.95 0.03 350)" />
      {/* Cheeks */}
      <circle cx="18" cy="40" r="5" fill="oklch(0.88 0.1 350)" opacity="0.5" />
      <circle cx="42" cy="40" r="5" fill="oklch(0.88 0.1 350)" opacity="0.5" />
      {/* Eyes */}
      <circle cx="24" cy="32" r="4" fill="oklch(0.25 0.05 260)" />
      <circle cx="36" cy="32" r="4" fill="oklch(0.25 0.05 260)" />
      <circle cx="25" cy="31" r="1.5" fill="white" />
      <circle cx="37" cy="31" r="1.5" fill="white" />
      {/* Nose */}
      <ellipse cx="30" cy="40" rx="3" ry="2" fill="oklch(0.75 0.15 350)" />
      {/* Mouth */}
      <path d="M27 43 Q30 46 33 43" stroke="oklch(0.5 0.1 350)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function CuteCat({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "sm" ? "w-12 h-12" : size === "lg" ? "w-24 h-24" : "w-16 h-16"
  return (
    <svg className={cn(sizeClass, "animate-float", className)} viewBox="0 0 60 60" fill="none">
      {/* Ears */}
      <path d="M12 25 L20 8 L28 25 Z" fill="oklch(0.78 0.14 55)" />
      <path d="M32 25 L40 8 L48 25 Z" fill="oklch(0.78 0.14 55)" />
      <path d="M16 23 L20 12 L24 23 Z" fill="oklch(0.88 0.1 350)" />
      <path d="M36 23 L40 12 L44 23 Z" fill="oklch(0.88 0.1 350)" />
      {/* Face */}
      <circle cx="30" cy="35" r="22" fill="oklch(0.85 0.12 55)" />
      {/* Eyes */}
      <ellipse cx="22" cy="32" rx="5" ry="6" fill="oklch(0.5 0.18 145)" />
      <ellipse cx="38" cy="32" rx="5" ry="6" fill="oklch(0.5 0.18 145)" />
      <ellipse cx="22" cy="33" rx="2" ry="4" fill="oklch(0.2 0.05 260)" />
      <ellipse cx="38" cy="33" rx="2" ry="4" fill="oklch(0.2 0.05 260)" />
      <circle cx="23" cy="31" r="1.5" fill="white" />
      <circle cx="39" cy="31" r="1.5" fill="white" />
      {/* Nose */}
      <path d="M28 42 L30 40 L32 42 L30 44 Z" fill="oklch(0.65 0.15 350)" />
      {/* Mouth */}
      <path d="M30 44 L30 47 M26 48 Q30 51 34 48" stroke="oklch(0.5 0.1 55)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Whiskers */}
      <g stroke="oklch(0.6 0.08 55)" strokeWidth="1" strokeLinecap="round">
        <line x1="8" y1="38" x2="18" y2="40" />
        <line x1="8" y1="42" x2="18" y2="42" />
        <line x1="8" y1="46" x2="18" y2="44" />
        <line x1="52" y1="38" x2="42" y2="40" />
        <line x1="52" y1="42" x2="42" y2="42" />
        <line x1="52" y1="46" x2="42" y2="44" />
      </g>
    </svg>
  )
}

export function CuteDog({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "sm" ? "w-12 h-12" : size === "lg" ? "w-24 h-24" : "w-16 h-16"
  return (
    <svg className={cn(sizeClass, "animate-wiggle", className)} viewBox="0 0 60 60" fill="none">
      {/* Ears */}
      <ellipse cx="14" cy="22" rx="10" ry="14" fill="oklch(0.6 0.12 55)" />
      <ellipse cx="46" cy="22" rx="10" ry="14" fill="oklch(0.6 0.12 55)" />
      {/* Face */}
      <circle cx="30" cy="35" r="22" fill="oklch(0.82 0.1 55)" />
      {/* Snout */}
      <ellipse cx="30" cy="44" rx="12" ry="10" fill="oklch(0.9 0.05 55)" />
      {/* Eyes */}
      <circle cx="22" cy="32" r="5" fill="oklch(0.25 0.05 260)" />
      <circle cx="38" cy="32" r="5" fill="oklch(0.25 0.05 260)" />
      <circle cx="23" cy="31" r="2" fill="white" />
      <circle cx="39" cy="31" r="2" fill="white" />
      {/* Nose */}
      <ellipse cx="30" cy="42" rx="5" ry="4" fill="oklch(0.3 0.05 260)" />
      <ellipse cx="30" cy="41" rx="2" ry="1" fill="oklch(0.5 0.05 260)" />
      {/* Tongue */}
      <ellipse cx="30" cy="52" rx="4" ry="5" fill="oklch(0.75 0.15 350)" />
      <path d="M30 48 L30 52" stroke="oklch(0.65 0.12 350)" strokeWidth="1" />
    </svg>
  )
}

export function FloatingHearts({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {[
        { top: "15%", left: "10%", size: 16, color: "oklch(0.75 0.2 350)", delay: "0s" },
        { top: "30%", right: "15%", size: 12, color: "oklch(0.78 0.18 25)", delay: "0.7s" },
        { top: "60%", left: "20%", size: 10, color: "oklch(0.8 0.16 350)", delay: "1.4s" },
        { top: "45%", right: "25%", size: 14, color: "oklch(0.72 0.2 350)", delay: "2s" },
      ].map((heart, i) => (
        <svg
          key={i}
          className="absolute animate-float"
          style={{
            top: heart.top,
            left: heart.left,
            right: heart.right,
            width: heart.size,
            height: heart.size,
            animationDelay: heart.delay,
          }}
          viewBox="0 0 24 24"
          fill={heart.color}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ))}
    </div>
  )
}

export function GrassAndFlowers({ className }: { className?: string }) {
  return (
    <div className={cn("absolute bottom-0 left-0 right-0 h-20 pointer-events-none overflow-hidden", className)}>
      <svg className="w-full h-full" viewBox="0 0 400 80" preserveAspectRatio="none" fill="none">
        {/* Grass hill */}
        <path d="M0 80 Q100 40 200 60 Q300 80 400 50 L400 80 Z" fill="oklch(0.75 0.16 145)" />
        <path d="M0 80 Q150 55 250 70 Q350 85 400 65 L400 80 Z" fill="oklch(0.7 0.14 145)" />
        
        {/* Flowers */}
        {/* Pink flower */}
        <g transform="translate(50, 50)">
          <circle cx="0" cy="-8" r="5" fill="oklch(0.8 0.18 350)" />
          <circle cx="6" cy="-3" r="5" fill="oklch(0.8 0.18 350)" />
          <circle cx="4" cy="5" r="5" fill="oklch(0.8 0.18 350)" />
          <circle cx="-4" cy="5" r="5" fill="oklch(0.8 0.18 350)" />
          <circle cx="-6" cy="-3" r="5" fill="oklch(0.8 0.18 350)" />
          <circle cx="0" cy="0" r="4" fill="oklch(0.9 0.14 95)" />
        </g>
        
        {/* Yellow flower */}
        <g transform="translate(150, 45)">
          <ellipse cx="0" cy="-6" rx="4" ry="6" fill="oklch(0.9 0.16 95)" />
          <ellipse cx="5" cy="-2" rx="4" ry="6" fill="oklch(0.9 0.16 95)" transform="rotate(60)" />
          <ellipse cx="5" cy="4" rx="4" ry="6" fill="oklch(0.9 0.16 95)" transform="rotate(120)" />
          <ellipse cx="0" cy="6" rx="4" ry="6" fill="oklch(0.9 0.16 95)" transform="rotate(180)" />
          <ellipse cx="-5" cy="4" rx="4" ry="6" fill="oklch(0.9 0.16 95)" transform="rotate(240)" />
          <ellipse cx="-5" cy="-2" rx="4" ry="6" fill="oklch(0.9 0.16 95)" transform="rotate(300)" />
          <circle cx="0" cy="0" r="4" fill="oklch(0.78 0.16 55)" />
        </g>

        {/* Blue flower */}
        <g transform="translate(280, 55)">
          <circle cx="0" cy="-6" r="4" fill="oklch(0.7 0.14 240)" />
          <circle cx="5" cy="-2" r="4" fill="oklch(0.7 0.14 240)" />
          <circle cx="3" cy="4" r="4" fill="oklch(0.7 0.14 240)" />
          <circle cx="-3" cy="4" r="4" fill="oklch(0.7 0.14 240)" />
          <circle cx="-5" cy="-2" r="4" fill="oklch(0.7 0.14 240)" />
          <circle cx="0" cy="0" r="3" fill="oklch(0.9 0.1 95)" />
        </g>

        {/* Tulip */}
        <g transform="translate(350, 48)">
          <path d="M0 0 L0 20" stroke="oklch(0.6 0.14 145)" strokeWidth="2" />
          <path d="M-6 0 Q0 -12 6 0 Q0 -4 -6 0" fill="oklch(0.75 0.18 350)" />
        </g>
      </svg>
    </div>
  )
}

// Page-specific section headers with cartoon backgrounds
export function SectionHeader({ 
  icon: Icon, 
  title, 
  subtitle,
  colorScheme = "pink",
  children 
}: { 
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  colorScheme?: "pink" | "blue" | "green" | "orange" | "purple";
  children?: React.ReactNode;
}) {
  const colorClasses = {
    pink: "icon-bg-pink",
    blue: "icon-bg-sky",
    green: "icon-bg-green",
    orange: "icon-bg-orange",
    purple: "icon-bg-purple",
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-transform hover:scale-105",
          colorClasses[colorScheme]
        )}>
          <Icon className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

// Fun card wrapper with playful styling
export function FunCard({ 
  children, 
  className,
  accentColor = "pink",
  withPattern = false
}: { 
  children: React.ReactNode;
  className?: string;
  accentColor?: "pink" | "blue" | "green" | "orange" | "purple" | "yellow";
  withPattern?: boolean;
}) {
  const borderColors = {
    pink: "border-l-[oklch(0.75_0.2_350)]",
    blue: "border-l-[oklch(0.7_0.14_240)]",
    green: "border-l-[oklch(0.75_0.16_145)]",
    orange: "border-l-[oklch(0.78_0.18_55)]",
    purple: "border-l-[oklch(0.7_0.18_290)]",
    yellow: "border-l-[oklch(0.9_0.16_95)]",
  }

  return (
    <div className={cn(
      "relative rounded-2xl bg-card border border-border p-5 shadow-sm overflow-hidden",
      "border-l-4",
      borderColors[accentColor],
      withPattern && "bg-pattern-dots",
      className
    )}>
      {children}
    </div>
  )
}

// Playful empty state
export function FunEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[oklch(0.88_0.12_350)] to-[oklch(0.85_0.14_290)] flex items-center justify-center animate-bounce-gentle">
          <Icon className="w-12 h-12 text-white" />
        </div>
        <FloatingStars className="absolute -inset-8" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-xs mb-6">{description}</p>
      {action}
    </div>
  )
}
