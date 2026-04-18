import { soloras } from "@/lib/tauri";

export function userAuthHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  };
}


export async function hubAuthHeaders(): Promise<HeadersInit> {
  try {
    const token = await soloras.getDeviceToken()
    if (!token) return {}
    return { Authorization: `Bearer ${token}` }
  } catch {
    return {}
  }
}
