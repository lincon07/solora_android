import { API_BASE } from "@/utils/common/api-url"

export type HealthResponse = {
  ok: boolean
  // optional extras if your backend returns them
  version?: string
  uptimeMs?: number
}

export async function fetchHealth(signal?: AbortSignal): Promise<HealthResponse> {
  const started = Date.now()

  const res = await fetch(`${API_BASE}/health`, {
    method: "GET",
    signal,
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`Health failed: HTTP ${res.status}`)
  }

  const json = (await res.json()) as any

  // normalize to { ok: boolean }
  return {
    ok: json?.ok ?? true,
    version: json?.version,
    uptimeMs: json?.uptimeMs ?? (Date.now() - started),
  }
}
