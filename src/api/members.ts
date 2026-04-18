import { api } from "./client"

/* =========================================================
 * Types
 * ========================================================= */

export type HubMemberRole = "owner" | "admin" | "member"

export type HubMember = {
  id: string
  hubId: string
  userId: string
  displayName: string
  role: HubMemberRole
  isActive: boolean
  createdAt: string
  avatarUrl?: string | null
}

export type HubUser = {
  id: string
  email: string
}

/* =========================================================
 * Fetch members
 * ========================================================= */

export function fetchHubMembers(hubId: string) {
  return api<{ hubId: string; members: HubMember[] }>(`/hub/${hubId}/info/members`, {
    auth: "hub",
  })
}

/* =========================================================
 * Fetch users that can be added (optional UI use)
 * ========================================================= */
export function fetchHubAddableUsers(hubId: string) {
  return api<{ hubId: string; users: HubUser[] }>(`/hub/${hubId}/users`, {
    auth: "hub",
  })
}

/* =========================================================
 * Create member
 * ========================================================= */

export function createHubMember(
  hubId: string,
  input: {
    userId: string
    displayName: string
    role?: HubMemberRole
    avatarUrl?: string | null
  }
) {
  return api<{ member: HubMember }>(`/hub/${hubId}/members`, {
    method: "POST",
    auth: "hub",
    body: JSON.stringify({
      userId: input.userId,
      displayName: input.displayName,
      role: input.role ?? "member",
      avatarUrl: input.avatarUrl && input.avatarUrl.trim().length > 0 ? input.avatarUrl.trim() : null,
    }),
  })
}

/* =========================================================
 * Update member
 * ========================================================= */

export function updateHubMember(
  hubId: string,
  memberId: string,
  input: {
    displayName?: string
    role?: HubMemberRole
    isActive?: boolean
    avatarUrl?: string | null
  }
) {
  return api<{ member: HubMember }>(`/hub/${hubId}/members/${memberId}`, {
    method: "PATCH",
    auth: "hub",
    body: JSON.stringify({
      ...(input.displayName !== undefined && { displayName: input.displayName }),
      ...(input.role !== undefined && { role: input.role }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
      ...(input.avatarUrl !== undefined && {
        avatarUrl: input.avatarUrl && input.avatarUrl.trim().length > 0 ? input.avatarUrl.trim() : null,
      }),
    }),
  })
}

/* =========================================================
 * Delete member
 * ========================================================= */

export function deleteHubMember(hubId: string, memberId: string) {
  return api<void>(`/hub/${hubId}/members/${memberId}`, {
    method: "DELETE",
    auth: "hub",
  })
}
