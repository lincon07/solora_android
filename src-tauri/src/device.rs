use tauri::AppHandle;
use tauri_plugin_store::StoreBuilder;

const STORE_PATH: &str = "soloras.store";
const TOKEN_KEY: &str = "device_token";

pub fn get_device_token(app: &AppHandle) -> Option<String> {
    let store = StoreBuilder::new(app, STORE_PATH).build().ok()?;
    store
        .get(TOKEN_KEY)
        .and_then(|v| v.as_str().map(|s| s.to_string()))
}

pub fn set_device_token(app: &AppHandle, token: &str) -> Result<(), String> {
    let store = StoreBuilder::new(app, STORE_PATH)
        .build()
        .map_err(|e| e.to_string())?;

    // ✅ FIX: no `.into()`
    store.set(TOKEN_KEY, token);
    store.save().map_err(|e| e.to_string())
}

pub fn clear_device_token(app: &AppHandle) {
    if let Ok(store) = StoreBuilder::new(app, STORE_PATH).build() {
        store.delete(TOKEN_KEY);
        let _ = store.save();
    }
}

pub fn is_paired(app: &AppHandle) -> bool {
    get_device_token(app).is_some()
}
