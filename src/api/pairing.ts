import { API_BASE } from "@/utils/common/api-url"

/* =========================================================
 * Types
 * ========================================================= */

export type PairingType = "hub" | "device" | "member"

export type PairingStatus = "pending" | "claimed" | "paired" | "expired"

export type PairingSessionResponse = {
  pairingId: string
  pairingCode: string
  expiresAt: number
}

export type PairingStatusResponse = {
  status: PairingStatus
  type: PairingType
  hubId: string | null
  userId: string | null
  deviceToken: string | null
}

export type CreatePairingInput = {
  type?: PairingType
  hubId?: string | null
}

/* =========================================================
 * Create Pairing Session (KIOSK)
 * Creates a new pairing session that generates a QR code
 * ========================================================= */

export async function createPairingSession(
  input?: CreatePairingInput
): Promise<PairingSessionResponse> {
  const res = await fetch(`${API_BASE}/pairing/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: input?.type ?? "hub",
      hubId: input?.hubId ?? null,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to create pairing session: ${text}`)
  }

  return res.json()
}

/* =========================================================
 * Fetch Pairing Status (KIOSK POLLING)
 * Polls to check if pairing has been claimed/paired
 * ========================================================= */

export async function fetchPairingStatus(
  pairingId: string
): Promise<PairingStatusResponse> {
  const res = await fetch(`${API_BASE}/pairing/status/${pairingId}`)

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to fetch pairing status: ${text}`)
  }

  return res.json()
}

/* =========================================================
 * Poll until resolved (utility)
 * Polls pairing status until it resolves or times out
 * ========================================================= */

export type PollOptions = {
  pairingId: string
  intervalMs?: number
  timeoutMs?: number
  onStatus?: (status: PairingStatusResponse) => void
}

export async function pollPairingUntilResolved(
  options: PollOptions
): Promise<PairingStatusResponse> {
  const { pairingId, intervalMs = 2000, timeoutMs = 300000, onStatus } = options

  const startTime = Date.now()

  return new Promise((resolve, reject) => {
    const poll = async () => {
      // Check timeout
      if (Date.now() - startTime > timeoutMs) {
        reject(new Error("Pairing polling timed out"))
        return
      }

      try {
        const status = await fetchPairingStatus(pairingId)
        onStatus?.(status)

        // Check if resolved
        if (status.status === "paired" || status.status === "claimed" || status.status === "expired") {
          resolve(status)
          return
        }

        // Continue polling
        setTimeout(poll, intervalMs)
      } catch (err) {
        console.error("[pairing] Poll error:", err)
        // Continue polling despite errors
        setTimeout(poll, intervalMs)
      }
    }

    poll()
  })
}
