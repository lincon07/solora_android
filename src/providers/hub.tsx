// src/context/HubContext.tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { fetchHubMe, fetchHubMembers, fetchHubUsers } from "@/api/hub"

export type Hub = {
  id: string
  ownerUserId: string
  name: string
  createdAt: string
}

export type HubMemberRow = {
  id: string
  hubId: string
  userId: string
  displayName: string
  role: "owner" | "admin" | "member"
  isActive: boolean
  createdAt: string
}

type HubContextValue = {
  hub: Hub | null
  hubId: string | null
  members: HubMemberRow[]
  users: { id: string; email: string }[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const HubContext = createContext<HubContextValue | null>(null)

export function HubProvider({ children }: { children: React.ReactNode }) {
  const [hub, setHub] = useState<Hub | null>(null)
  const [members, setMembers] = useState<HubMemberRow[]>([])
  const [users, setUsers] = useState<{ id: string; email: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    try {
      setLoading(true)
      setError(null)

      const me = await fetchHubMe()
      if (!me) {
        setHub(null)
        setMembers([])
        setUsers([])
        return
      }

      setHub(me.hub)

      const [m, u] = await Promise.all([
        fetchHubMembers(me.hub.id),
        fetchHubUsers(me.hub.id),
      ])

      setMembers(m.members)
      setUsers(u.users)
    } catch (e) {
      console.error("[HubProvider]", e)
      setError("Failed to load hub")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <HubContext.Provider
      value={{
        hub,
        hubId: hub?.id ?? null,
        members,
        users,
        loading,
        error,
        refresh: load,
      }}
    >
      {children}
    </HubContext.Provider>
  )
}

export function useHub() {
  const ctx = useContext(HubContext)
  if (!ctx) {
    throw new Error("useHub must be used inside <HubProvider>")
  }
  return ctx
}
