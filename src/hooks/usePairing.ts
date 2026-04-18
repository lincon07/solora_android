import {
  createPairingSession,
  fetchPairingStatus,
  type PairingType,
  type PairingStatus,
  type PairingStatusResponse,
} from "@/api/pairing"
import { generateQR } from "@/utils/common/create-qr"
import { useCallback, useEffect, useRef, useState } from "react"

/* =========================================================
 * Types
 * ========================================================= */

export type PairingState = "idle" | "loading" | "polling" | "resolved" | "error"

export type UsePairingOptions = {
  type: PairingType
  hubId?: string
  pollIntervalMs?: number
  autoStart?: boolean
  onResolved?: (data: PairingStatusResponse) => void
  onError?: (error: Error) => void
}

export type UsePairingReturn = {
  // State
  state: PairingState
  pairing: { pairingId: string; pairingCode: string; expiresAt: number } | null
  qr: string | null
  status: PairingStatus | null
  error: string | null
  
  // Resolved data
  resolvedData: PairingStatusResponse | null
  
  // Actions
  start: () => Promise<void>
  stop: () => void
  reset: () => void
}

/* =========================================================
 * Hook
 * ========================================================= */

export function usePairing(options: UsePairingOptions): UsePairingReturn {
  const {
    type,
    hubId,
    pollIntervalMs = 2000,
    autoStart = false,
    onResolved,
    onError,
  } = options

  // State
  const [state, setState] = useState<PairingState>("idle")
  const [pairing, setPairing] = useState<UsePairingReturn["pairing"]>(null)
  const [qr, setQr] = useState<string | null>(null)
  const [status, setStatus] = useState<PairingStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [resolvedData, setResolvedData] = useState<PairingStatusResponse | null>(null)

  // Refs for cleanup
  const pollingRef = useRef<{
    active: boolean
    timeoutId: ReturnType<typeof setTimeout> | null
  }>({
    active: false,
    timeoutId: null,
  })

  const mountedRef = useRef(true)

  /* ---------------------------------------------------------
   * Stop polling
   * --------------------------------------------------------- */
  const stop = useCallback(() => {
    pollingRef.current.active = false
    if (pollingRef.current.timeoutId) {
      clearTimeout(pollingRef.current.timeoutId)
      pollingRef.current.timeoutId = null
    }
  }, [])

  /* ---------------------------------------------------------
   * Reset to initial state
   * --------------------------------------------------------- */
  const reset = useCallback(() => {
    stop()
    setState("idle")
    setPairing(null)
    setQr(null)
    setStatus(null)
    setError(null)
    setResolvedData(null)
  }, [stop])

  /* ---------------------------------------------------------
   * Poll for status changes
   * --------------------------------------------------------- */
  const pollStatus = useCallback(
    async (pairingId: string) => {
      if (!pollingRef.current.active || !mountedRef.current) return

      try {
        const res = await fetchPairingStatus(pairingId)

        if (!mountedRef.current) return

        console.log("[v0] Pairing poll result:", res)
        setStatus(res.status)

        // Check if resolved
        if (res.status === "paired" || res.status === "claimed" || res.status === "expired") {
          stop()
          setResolvedData(res)
          setState("resolved")
          onResolved?.(res)
          return
        }

        // Continue polling
        if (pollingRef.current.active) {
          pollingRef.current.timeoutId = setTimeout(
            () => pollStatus(pairingId),
            pollIntervalMs
          )
        }
      } catch (err) {
        console.error("[v0] Pairing poll error:", err)
        // Continue polling despite errors
        if (pollingRef.current.active && mountedRef.current) {
          pollingRef.current.timeoutId = setTimeout(
            () => pollStatus(pairingId),
            pollIntervalMs
          )
        }
      }
    },
    [pollIntervalMs, onResolved, stop]
  )

  /* ---------------------------------------------------------
   * Start a new pairing session
   * --------------------------------------------------------- */
  const start = useCallback(async () => {
    // Reset previous state
    reset()
    setState("loading")
    setError(null)

    try {
      // Create pairing session
      const session = await createPairingSession({ type, hubId })

      if (!mountedRef.current) return

      console.log("[v0] Pairing session created:", session)

      setPairing({
        pairingId: session.pairingId,
        pairingCode: session.pairingCode,
        expiresAt: session.expiresAt,
      })
      setStatus("pending")

      // Generate QR code
      const qrData = JSON.stringify({
        pairingId: session.pairingId,
        pairingCode: session.pairingCode,
        type,
      })
      const qrImg = await generateQR(qrData)

      if (!mountedRef.current) return

      setQr(qrImg)
      setState("polling")

      // Start polling
      pollingRef.current.active = true
      pollStatus(session.pairingId)
    } catch (err: any) {
      if (!mountedRef.current) return

      console.error("[v0] Failed to create pairing session:", err)
      setError(err?.message ?? "Failed to create pairing session")
      setState("error")
      onError?.(err)
    }
  }, [type, hubId, reset, pollStatus, onError])

  /* ---------------------------------------------------------
   * Auto-start if enabled
   * --------------------------------------------------------- */
  useEffect(() => {
    if (autoStart) {
      start()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart])

  /* ---------------------------------------------------------
   * Cleanup on unmount
   * --------------------------------------------------------- */
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      stop()
    }
  }, [stop])

  return {
    state,
    pairing,
    qr,
    status,
    error,
    resolvedData,
    start,
    stop,
    reset,
  }
}
