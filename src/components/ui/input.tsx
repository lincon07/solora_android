import { TextField, TextFieldProps as MuiTextFieldProps } from "@mui/material"
import React from "react"

export interface InputProps extends Omit<MuiTextFieldProps, "variant"> {
  variant?: "outlined" | "filled" | "standard"
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant = "outlined", ...props }, ref) => (
    <TextField
      ref={ref}
      variant={variant}
      {...props}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
        },
        ...props.sx,
      }}
    />
  )
)

Input.displayName = "Input"
