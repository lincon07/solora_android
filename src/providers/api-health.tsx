"use client"

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import { fetchHealth, type HealthResponse } from "@/api/health"

type ApiHealthState = {
  status: "unknown" | "ok" | "down"
  initialized: boolean
  lastOkAt: number | null
  lastError: string | null
  health: HealthResponse | null
  refresh: () => Promise<void>
}


const ApiHealthContext = createContext<ApiHealthState | null>(null)

export function ApiHealthProvider({
  children,
  intervalMs = 5000,
}: {
  children: React.ReactNode
  intervalMs?: number
}) {
  const [status, setStatus] = useState<ApiHealthState["status"]>("unknown")
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [lastOkAt, setLastOkAt] = useState<number | null>(null)
  const [lastError, setLastError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  async function refresh() {
    try {
      abortRef.current?.abort()
      abortRef.current = new AbortController()

      const h = await fetchHealth(abortRef.current.signal)

      if (!h.ok) {
        setStatus("down")
        setHealth(h)
        setLastError("Health returned ok=false")
      } else {
        setStatus("ok")
        setHealth(h)
        setLastOkAt(Date.now())
        setLastError(null)
      }
    } catch (e: any) {
      setStatus("down")
      setHealth(null)
      setLastError(e?.message ?? "Health check failed")
    } finally {
      setInitialized(true) // ✅ FIRST DECISION MADE
    }
  }


  useEffect(() => {
    refresh()

    timerRef.current = setInterval(() => {
      refresh()
    }, intervalMs)

    return () => {
      timerRef.current && clearInterval(timerRef.current)
      abortRef.current?.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs])

const value = useMemo<ApiHealthState>(
  () => ({ status, initialized, health, lastOkAt, lastError, refresh }),
  [status, initialized, health, lastOkAt, lastError]
)


  return <ApiHealthContext.Provider value={value}>{children}</ApiHealthContext.Provider>
}

export function useApiHealth() {
  const ctx = useContext(ApiHealthContext)
  if (!ctx) throw new Error("useApiHealth must be used inside ApiHealthProvider")
  return ctx
}
