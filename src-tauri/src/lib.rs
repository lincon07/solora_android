mod device;

use tauri::AppHandle;

/* ==========================
   COMMANDS
   ========================== */

#[tauri::command]
fn greet(name: String) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn device_get_token(app: AppHandle) -> Option<String> {
    device::get_device_token(&app)
}

#[tauri::command]
fn device_set_token(
    app: AppHandle,
    token: String,
) -> Result<(), String> {
    if token.is_empty() {
        return Err("token is empty".into());
    }

    device::set_device_token(&app, &token)
}

#[tauri::command]
fn device_clear_token(app: AppHandle) {
    device::clear_device_token(&app)
}

#[tauri::command]
fn device_is_paired(app: AppHandle) -> bool {
    device::is_paired(&app)
}

/* ==========================
   APP ENTRY
   ========================== */

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            greet,
            device_get_token,
            device_set_token,
            device_clear_token,
            device_is_paired
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
