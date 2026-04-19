import React, { createContext, useContext, useMemo, useState } from "react"
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from "@mui/material"
import { PaletteMode } from "@mui/material"

type ThemeContextType = {
  mode: PaletteMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedTheme = localStorage.getItem("mui-theme") as PaletteMode
    return savedTheme || "light"
  })

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light"
      localStorage.setItem("mui-theme", newMode)
      return newMode
    })
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                // Light mode
                primary: {
                  main: "#424242",
                  light: "#757575",
                  dark: "#212121",
                },
                secondary: {
                  main: "#757575",
                  light: "#bdbdbd",
                  dark: "#424242",
                },
                background: {
                  default: "#fafafa",
                  paper: "#ffffff",
                },
                text: {
                  primary: "#212121",
                  secondary: "#757575",
                },
                divider: "#e0e0e0",
              }
            : {
                // Dark mode
                primary: {
                  main: "#e0e0e0",
                  light: "#ffffff",
                  dark: "#9e9e9e",
                },
                secondary: {
                  main: "#9e9e9e",
                  light: "#f5f5f5",
                  dark: "#616161",
                },
                background: {
                  default: "#121212",
                  paper: "#1e1e1e",
                },
                text: {
                  primary: "#ffffff",
                  secondary: "#b0b0b0",
                },
                divider: "#424242",
              }),
        },
        typography: {
          fontFamily:
            '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          h1: { fontSize: "2rem", fontWeight: 600 },
          h2: { fontSize: "1.5rem", fontWeight: 600 },
          h3: { fontSize: "1.25rem", fontWeight: 600 },
          h4: { fontSize: "1rem", fontWeight: 600 },
          h5: { fontSize: "0.875rem", fontWeight: 600 },
          h6: { fontSize: "0.75rem", fontWeight: 600 },
          body1: { fontSize: "1rem", fontWeight: 400 },
          body2: { fontSize: "0.875rem", fontWeight: 400 },
          button: { textTransform: "none" as const },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
                padding: "8px 16px",
              },
              contained: {
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                borderRadius: "12px",
              },
            },
          },
          MuiTextField: {
            defaultProps: {
              variant: "outlined" as const,
            },
            styleOverrides: {
              root: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              root: {
                borderRadius: "8px",
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              root: {
                padding: "8px",
              },
            },
          },
        },
        shape: {
          borderRadius: 8,
        },
      }),
    [mode]
  )

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
