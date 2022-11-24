#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{fs::File, io::Write, path::Path};

#[tauri::command]
fn makefile(filename: String, username: String, phone: String, email: String) -> String {
    let desktop = tauri::api::path::desktop_dir().unwrap();
    let path = Path::new(&desktop).join(&filename);
    let mut file = File::create(path).unwrap();

    file.write_all(format!("Navn: {}\rTlf. nr.: {}\rEmail: {}", username, phone, email).as_bytes())
        .unwrap();

    format!("{} lavet på dit skrivebord!", filename)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![makefile])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
