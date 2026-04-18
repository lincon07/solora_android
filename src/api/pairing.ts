import { API_BASE } from "@/utils/common/api-url"

export type PairingType = "hub" | "device" | "member"

export type PairingSessionResponse = {
  pairingId: string
  pairingCode: string
  expiresAt: number
}

export type PairingStatusResponse = {
  status: "pending" | "claimed" | "paired" | "expired"
  type: PairingType
  hubId?: string | null
  userId?: string | null
  deviceToken?: string | null
}

export async function createPairingSession(input?: {
  type?: PairingType
  hubId?: string
}): Promise<PairingSessionResponse> {
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

export async function fetchPairingStatus(pairingId: string): Promise<PairingStatusResponse> {
  const res = await fetch(`${API_BASE}/pairing/status/${pairingId}`)

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to fetch pairing status: ${text}`)
  }

  return res.json()
}
