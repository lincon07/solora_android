import { Card as MuiCard, CardProps as MuiCardProps, Box, Typography, useTheme } from "@mui/material"
import React from "react"

export const Card = React.forwardRef<HTMLDivElement, MuiCardProps & React.ComponentProps<"div">>(
  ({ children, ...props }, ref) => (
    <MuiCard
      ref={ref}
      {...props}
      sx={{
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        ...props.sx,
      }}
    >
      {children}
    </MuiCard>
  )
)
Card.displayName = "Card"

export const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ children, ...props }, ref) => (
    <Box
      ref={ref}
      {...props}
      sx={{
        padding: "24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "8px",
        ...props.sx,
      }}
    >
      {children}
    </Box>
  )
)
CardHeader.displayName = "CardHeader"

export const CardTitle = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ children, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="h6"
      {...props}
      sx={{
        fontWeight: 600,
        fontSize: "1rem",
        lineHeight: 1.2,
        ...props.sx,
      }}
    >
      {children}
    </Typography>
  )
)
CardTitle.displayName = "CardTitle"

export const CardDescription = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ children, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="body2"
      {...props}
      sx={{
        fontSize: "0.875rem",
        color: "text.secondary",
        ...props.sx,
      }}
    >
      {children}
    </Typography>
  )
)
CardDescription.displayName = "CardDescription"

export const CardAction = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ children, ...props }, ref) => (
    <Box
      ref={ref}
      {...props}
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        ...props.sx,
      }}
    >
      {children}
    </Box>
  )
)
CardAction.displayName = "CardAction"

export const CardContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ children, ...props }, ref) => (
    <Box
      ref={ref}
      {...props}
      sx={{
        padding: "16px 24px",
        ...props.sx,
      }}
    >
      {children}
    </Box>
  )
)
CardContent.displayName = "CardContent"

export const CardFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ children, ...props }, ref) => (
    <Box
      ref={ref}
      {...props}
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "16px 24px",
        gap: "8px",
        ...props.sx,
      }}
    >
      {children}
    </Box>
  )
)
CardFooter.displayName = "CardFooter"
