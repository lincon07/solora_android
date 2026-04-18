import { hubAuthHeaders, userAuthHeaders } from "@/utils/common/api-headers"
import { API_BASE } from "@/utils/common/api-url"

/* =========================================================
 * Types
 * ========================================================= */

export type Hub = {
  id: string
  ownerUserId: string
  name: string
  alias?: string | null
  timezone?: string | null
  platform?: string | null
  createdAt: string
  lastSeenAt?: string | null
}

/* =========================================================
 * Hub core
 * ========================================================= */

export async function fetchHubMe(): Promise<{ hub: Hub } | null> {
  const res = await fetch(`${API_BASE}/hub/me`, {
    headers: await hubAuthHeaders(),
  })

  // device not paired yet
  if (res.status === 401) {
    return null
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch hub: ${res.status}`)
  }

  return res.json()
}

/* =========================================================
 * Hub info routes
 * ========================================================= */

export async function fetchHubMembers(hubId: string) {
  const res = await fetch(`${API_BASE}/hub/${hubId}/info/members`, {
    headers: await hubAuthHeaders(),
  })

  if (!res.ok) {
    throw new Error("Failed to fetch hub members")
  }

  return res.json() as Promise<{
    hubId: string
    members: any[]
  }>
}

export async function fetchHubUsers(hubId: string) {
  const res = await fetch(`${API_BASE}/hub/${hubId}/users`, {
    headers: await hubAuthHeaders(),
  })

  if (!res.ok) {
    throw new Error("Failed to fetch hub users")
  }

  return res.json() as Promise<{
    hubId: string
    users: { id: string; email: string }[]
  }>
}

/* =========================================================
 * Settings / actions
 * ========================================================= */

export async function updateHubSettings(input: {
  name?: string
  alias?: string | null
  timezone?: string | null
}) {
  const res = await fetch(`${API_BASE}/hub`, {
    method: "PATCH",
    headers: {
      ...(await hubAuthHeaders()),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    throw new Error("Failed to update hub")
  }

  return res.json()
}

export async function startDevicePairing(hubId: string) {
  const res = await fetch(`${API_BASE}/hub/${hubId}/devices/pair`, {
    method: "POST",
    headers: await userAuthHeaders(),
  })

  if (!res.ok) {
    throw new Error("Failed to start pairing")
  }

  return res.json()
}
