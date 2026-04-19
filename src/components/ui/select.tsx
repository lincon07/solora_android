import {
  Select as MuiSelect,
  MenuItem,
  FormControl,
  FormControlProps,
  SelectProps as MuiSelectProps,
  Box,
  Typography,
} from "@mui/material"
import React from "react"

export function Select({ ...props }: { children: React.ReactNode }) {
  return <>{props.children}</>
}

export function SelectGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function SelectValue() {
  return null
}

export interface SelectTriggerProps extends Omit<MuiSelectProps, "variant"> {
  size?: "sm" | "default"
  children?: React.ReactNode
}

export const SelectTrigger = React.forwardRef<any, SelectTriggerProps>(
  ({ size = "default", ...props }, ref) => (
    <MuiSelect
      ref={ref}
      size={size === "sm" ? "small" : "medium"}
      {...props}
    />
  )
)
SelectTrigger.displayName = "SelectTrigger"

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export const SelectLabel = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  (props, ref) => (
    <Typography
      ref={ref}
      variant="caption"
      sx={{
        display: "block",
        padding: "6px 8px",
        fontSize: "0.75rem",
        color: "text.secondary",
      }}
      {...props}
    />
  )
)
SelectLabel.displayName = "SelectLabel"

export const SelectItem = React.forwardRef<HTMLLIElement, React.ComponentProps<typeof MenuItem>>(
  (props, ref) => <MenuItem ref={ref} {...props} />
)
SelectItem.displayName = "SelectItem"

export const SelectSeparator = () => <Box sx={{ borderBottom: "1px solid", borderColor: "divider", my: 0.5 }} />
SelectSeparator.displayName = "SelectSeparator"

export const SelectScrollUpButton = () => null
export const SelectScrollDownButton = () => null
