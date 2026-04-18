import { soloras } from "@/lib/tauri"
import { API_BASE } from "@/utils/common/api-url"
import { toast } from "sonner"

/* =========================================================
 * Types
 * ========================================================= */

type ApiOptions = RequestInit & {
  auth?: "hub" | "user" | "none"
  timeoutMs?: number
  silent?: boolean // 👈 prevents toast spam (pairing/offline)
}

/* =========================================================
 * Environment detection
 * ========================================================= */


/* =========================================================
 * Token helpers (SAFE)
 * ========================================================= */

async function getHubToken(): Promise<string | null> {
  try {
   const token = await soloras.getDeviceToken().then((t) => {
    console.log("Retrieved hub token:", t);
    return t;
   })
    return token;
  } catch (err) {
    console.warn("[api] Failed to get hub token", err)
    return null
  }
}

async function getUserToken(): Promise<string | null> {
  // Not implemented yet — safe stub
  return null
}

/* =========================================================
 * Timeout helper
 * ========================================================= */

function withTimeout(ms: number): AbortController {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), ms)
  return controller
}

/* =========================================================
 * Core API client (HARDENED)
 * ========================================================= */

export async function api<T>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const {
    auth = "hub",
    headers,
    timeoutMs = 10_000,
    silent = false,
    ...rest
  } = options

  let authHeader: HeadersInit = {}

  /* ---------------------------------------------------------
   * Auth handling (NON-FATAL)
   * --------------------------------------------------------- */

  if (auth === "hub") {
    const token = await getHubToken()

    // IMPORTANT:
    // - During pairing / offline / browser → token WILL be null
    // - This MUST NOT throw
    if (token) {
      authHeader = { Authorization: `Bearer ${token}` }
    } else {
      // allow request to continue without auth
      console.warn("[api] No hub token (unpaired / browser)")
    }
  }

  if (auth === "user") {
    const token = await getUserToken()
    if (token) {
      authHeader = { Authorization: `Bearer ${token}` }
    }
  }

  /* ---------------------------------------------------------
   * Request
   * --------------------------------------------------------- */

  const controller = withTimeout(timeoutMs)

  let res: Response

  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...rest,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
        ...(headers ?? {}),
      },
    })
  } catch (err: any) {
    // Network error, timeout, offline, server down
    if (!silent) {
      console.warn("[api] Network error:", path, err)
    }

    throw new Error("NETWORK_ERROR")
  }

  /* =========================================================
   * Error handling (SAFE)
   * ========================================================= */

  if (res.status === 401) {
    if (!silent) {
      toast.error("Unauthorized")
    }
    throw new Error("UNAUTHORIZED")
  }

  if (!res.ok) {
    let message = `HTTP ${res.status}`

    try {
      const data = await res.json()
      message = data?.error ?? message
    } catch {
      message = res.statusText || message
    }

    if (!silent) {
      toast.error(`API Error: ${message}`)
    }

    throw new Error(message)
  }

  /* =========================================================
   * Response handling
   * ========================================================= */

  // 204 No Content
  if (res.status === 204) {
    return undefined as T
  }

  const text = await res.text()
  if (!text) {
    return undefined as T
  }

  try {
    return JSON.parse(text) as T
  } catch {
    // Edge case: backend returns empty string / invalid JSON
    return undefined as T
  }
}
