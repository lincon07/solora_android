import { Switch as MuiSwitch, SwitchProps as MuiSwitchProps } from "@mui/material"
import React from "react"

export interface SwitchProps extends Omit<MuiSwitchProps, "size"> {
  size?: "sm" | "default"
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ size = "default", ...props }, ref) => {
    const muiSize = size === "sm" ? "small" : "medium"
    return (
      <MuiSwitch
        ref={ref}
        size={muiSize}
        {...props}
      />
    )
  }
)

Switch.displayName = "Switch"
