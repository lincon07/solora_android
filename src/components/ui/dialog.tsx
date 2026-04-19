import {
  Dialog as MuiDialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions,
  Box,
  IconButton,
  Typography,
} from "@mui/material"
import { Close as CloseIcon } from "@mui/icons-material"
import React from "react"
import { Button } from "./button"

interface DialogState {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = React.createContext<DialogState | undefined>(undefined)

export function Dialog({ open, onOpenChange, children }: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const actualOpen = isControlled ? open : internalOpen
  const setOpen = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <DialogContext.Provider value={{ open: actualOpen, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

export const DialogTrigger = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  (props, ref) => {
    const context = React.useContext(DialogContext)
    if (!context) throw new Error("DialogTrigger must be used within Dialog")
    return (
      <Button
        ref={ref}
        {...props}
        onClick={(e) => {
          context.setOpen(true)
          props.onClick?.(e as any)
        }}
      />
    )
  }
)
DialogTrigger.displayName = "DialogTrigger"

export function DialogPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function DialogClose({ children, ...props }: React.ComponentProps<"button">) {
  const context = React.useContext(DialogContext)
  if (!context) throw new Error("DialogClose must be used within Dialog")
  return (
    <button
      {...props}
      onClick={(e) => {
        context.setOpen(false)
        props.onClick?.(e)
      }}
    >
      {children}
    </button>
  )
}

export function DialogOverlay() {
  return null
}

interface DialogContentProps extends React.ComponentProps<"div"> {
  showCloseButton?: boolean
}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ children, showCloseButton = true, ...props }, ref) => {
    const context = React.useContext(DialogContext)
    if (!context) throw new Error("DialogContent must be used within Dialog")

    return (
      <MuiDialog
        open={context.open}
        onClose={() => context.setOpen(false)}
        maxWidth="sm"
        fullWidth
        ref={ref}
      >
        {showCloseButton && (
          <IconButton
            onClick={() => context.setOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "text.secondary",
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
        <MuiDialogContent {...props}>
          {children}
        </MuiDialogContent>
      </MuiDialog>
    )
  }
)
DialogContent.displayName = "DialogContent"

export function DialogHeader({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", mb: 2 }} {...props}>
      {children}
    </Box>
  )
}

interface DialogFooterProps extends React.ComponentProps<"div"> {
  showCloseButton?: boolean
}

export function DialogFooter({ children, showCloseButton = false, ...props }: DialogFooterProps) {
  const context = React.useContext(DialogContext)
  return (
    <DialogActions {...props} sx={{ display: "flex", gap: 1 }}>
      {children}
      {showCloseButton && context && (
        <Button variant="outline" onClick={() => context.setOpen(false)}>
          Close
        </Button>
      )}
    </DialogActions>
  )
}

export const DialogTitle = React.forwardRef<HTMLDivElement, React.ComponentProps<"h2">>(
  ({ children, ...props }, ref) => (
    <MuiDialogTitle ref={ref} {...props}>
      {children}
    </MuiDialogTitle>
  )
)
DialogTitle.displayName = "DialogTitle"

export const DialogDescription = React.forwardRef<HTMLDivElement, React.ComponentProps<"p">>(
  ({ children, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="body2"
      color="text.secondary"
      {...props}
    >
      {children}
    </Typography>
  )
)
DialogDescription.displayName = "DialogDescription"
