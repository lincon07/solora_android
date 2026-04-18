import { invoke } from "@tauri-apps/api/core"

export const soloras = {
  greet: (name: string) =>
    invoke<string>("greet", { name }),

  getDeviceToken: () =>
    invoke<string | null>("device_get_token"),

  setDeviceToken: (token: string) =>
    invoke<void>("device_set_token", { token }),

  clearDeviceToken: () =>
    invoke<void>("device_clear_token"),

  isPaired: () =>
    invoke<boolean>("device_is_paired"),

  setSystemBrightness(percent: number) {
    return invoke("setBrightness", { percent })
  }
}


