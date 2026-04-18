import { fetchHubMe } from "@/api/hub"
import React, { createContext, useContext, useCallback, useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

/* =========================================================
 * Types
 * ========================================================= */

export type PairingState = "checking" | "unpaired" | "paired" | "error"

export interface PairingContextType {
  state: PairingState
  hubId: string | null
  error: string | null
  checkPairing: () => Promise<void>
  setPaired: (hubId: string) => void
}

const defaultContext: PairingContextType = {
  state: "checking",
  hubId: null,
  error: null,
  checkPairing: async () => {},
  setPaired: () => {},
}

export const PairingContext = createContext<PairingContextType>(defaultContext)

/* =========================================================
 * Provider
 * ========================================================= */

export const PairingProvider: React.FC<React.PropsWithChildren<object>> = ({
  children,
}) => {
  const nav = useNavigate()
  const location = useLocation()

  const [state, setState] = useState<PairingState>("checking")
  const [hubId, setHubId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  /* ---------------------------------------------------------
   * Check pairing status
   * --------------------------------------------------------- */
  const checkPairing = useCallback(async () => {
    setState("checking")
    setError(null)

    try {
      console.log("[v0] Checking pairing status...")
      const result = await fetchHubMe()

      if (result?.hub) {
        console.log("[v0] Hub paired:", result.hub.id)
        setHubId(result.hub.id)
        setState("paired")

        // Redirect to home if on onboard page
        if (location.pathname.startsWith("/onboard")) {
          nav("/")
        }
      } else {
        console.log("[v0] Hub not paired")
        setHubId(null)
        setState("unpaired")

        // Redirect to onboard if not already there
        if (!location.pathname.startsWith("/onboard")) {
          nav("/onboard-wizzard")
        }
      }
    } catch (err: any) {
      console.error("[v0] Failed to check pairing:", err)
      
      // 401 means not paired - this is expected
      if (err?.message === "UNAUTHORIZED" || err?.message?.includes("401")) {
        setHubId(null)
        setState("unpaired")
        
        if (!location.pathname.startsWith("/onboard")) {
          nav("/onboard-wizzard")
        }
      } else {
        setError(err?.message ?? "Failed to check pairing status")
        setState("error")
      }
    }
  }, [nav, location.pathname])

  /* ---------------------------------------------------------
   * Set paired (called after successful pairing)
   * --------------------------------------------------------- */
  const setPaired = useCallback(
    (newHubId: string) => {
      console.log("[v0] Setting paired state:", newHubId)
      setHubId(newHubId)
      setState("paired")
    },
    []
  )

  /* ---------------------------------------------------------
   * Initial check on mount
   * --------------------------------------------------------- */
  useEffect(() => {
    checkPairing()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PairingContext.Provider
      value={{
        state,
        hubId,
        error,
        checkPairing,
        setPaired,
      }}
    >
      {children}
    </PairingContext.Provider>
  )
}

/* =========================================================
 * Hook
 * ========================================================= */

export function usePairingContext() {
  const context = useContext(PairingContext)
  if (!context) {
    throw new Error("usePairingContext must be used within PairingProvider")
  }
  return context
}
