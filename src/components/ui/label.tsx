import { FormControlLabel, FormControlLabelProps, Typography } from "@mui/material"
import React from "react"

export const Label = React.forwardRef<HTMLLabelElement, React.ComponentProps<"label">>(
  ({ children, ...props }, ref) => (
    <Typography
      component="label"
      ref={ref}
      variant="body2"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "0.875rem",
        fontWeight: 500,
        userSelect: "none",
        ...props.style,
      }}
      {...props}
    >
      {children}
    </Typography>
  )
)

Label.displayName = "Label"
