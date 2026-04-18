import { createPairingSession, fetchPairingStatus } from "@/api/pairing"
import { generateQR } from "@/utils/common/create-qr"
import { useEffect, useRef, useState } from "react"

type UsePairingOptions = {
  type: "hub" | "device" | "member"
  hubId?: string
  onResolved?: (data: {
    status?: string
    type?: string
    userId?: string | null
    hubId?: string | null
    deviceToken?: string | null
  }) => void
}

export function usePairing(options: UsePairingOptions) {
  const { type, hubId, onResolved } = options

  const [pairing, setPairing] = useState<{ pairingId: string; pairingCode: string } | null>(null)
  const [qr, setQr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const pollingRef = useRef<{ cancelled: boolean; timeoutId?: ReturnType<typeof setTimeout> }>({
    cancelled: false,
  })

  function stopPolling() {
    pollingRef.current.cancelled = true
    if (pollingRef.current.timeoutId) clearTimeout(pollingRef.current.timeoutId)
  }

  function reset() {
    stopPolling()
    setPairing(null)
    setQr(null)
    setLoading(false)
  }

  async function start() {
    reset()
    pollingRef.current.cancelled = false
    setLoading(true)

    const session = await createPairingSession({ type, hubId })
    setPairing(session)

    const qrImg = await generateQR(JSON.stringify({ pairingId: session.pairingId }))
    setQr(qrImg)
    setLoading(false)
  }

  useEffect(() => {
    if (!pairing?.pairingId) return

    async function poll() {
      if (pollingRef.current.cancelled) return

      try {
        const res = await fetchPairingStatus(pairing?.pairingId as string)
        console.log("🔄 Pairing poll:", res)

        if (res.status === "paired" || res.status === "claimed" || res.status === "expired") {
          stopPolling()
          onResolved?.(res as any)
          return
        }
      } catch (err) {
        console.error("Pairing poll error:", err)
      }

      pollingRef.current.timeoutId = setTimeout(poll, 2000)
    }

    poll()
    return () => stopPolling()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairing?.pairingId])

  return { pairing, qr, loading, start, reset }
}
