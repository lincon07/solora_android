import { ButtonProps as MuiButtonProps, Button as MuiButton } from "@mui/material"
import React from "react"

export interface ButtonProps extends Omit<MuiButtonProps, "variant"> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "contained" | "outlined" | "text"
  size?: "xs" | "sm" | "default" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", ...props }, ref) => {
    let muiVariant: MuiButtonProps["variant"] = "contained"
    let muiSize: MuiButtonProps["size"] = "medium"
    let color: MuiButtonProps["color"] = "primary"
    let sx: any = {}

    // Map variant
    if (variant === "default" || variant === "contained") {
      muiVariant = "contained"
    } else if (variant === "destructive") {
      muiVariant = "contained"
      color = "error"
    } else if (variant === "outline" || variant === "outlined") {
      muiVariant = "outlined"
    } else if (variant === "secondary") {
      muiVariant = "contained"
      color = "inherit"
    } else if (variant === "ghost" || variant === "link") {
      muiVariant = "text"
    } else if (variant === "text") {
      muiVariant = "text"
    }

    // Map size
    if (size === "xs") {
      muiSize = "small"
      sx = { padding: "4px 8px", fontSize: "0.75rem" }
    } else if (size === "sm") {
      muiSize = "small"
    } else if (size === "default") {
      muiSize = "medium"
    } else if (size === "lg") {
      muiSize = "large"
    } else if (size?.startsWith("icon")) {
      sx = { minWidth: "auto", padding: "8px" }
      if (size === "icon-xs") {
        sx = { ...sx, width: "24px", height: "24px", padding: "4px" }
        muiSize = "small"
      } else if (size === "icon-sm") {
        sx = { ...sx, width: "32px", height: "32px" }
        muiSize = "small"
      } else if (size === "icon-lg") {
        sx = { ...sx, width: "40px", height: "40px" }
        muiSize = "large"
      } else {
        sx = { ...sx, width: "36px", height: "36px" }
      }
    }

    return (
      <MuiButton
        ref={ref}
        variant={muiVariant}
        size={muiSize}
        color={color}
        sx={{ ...sx, ...props.sx }}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"
