import { Checkbox as MuiCheckbox, CheckboxProps as MuiCheckboxProps } from "@mui/material"
import React from "react"

export const Checkbox = React.forwardRef<HTMLButtonElement, MuiCheckboxProps>(
  (props, ref) => (
    <MuiCheckbox
      ref={ref}
      {...props}
      sx={{
        borderRadius: "4px",
        ...props.sx,
      }}
    />
  )
)

Checkbox.displayName = "Checkbox"
