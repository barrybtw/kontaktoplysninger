#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{fs::File, io::Write, path::Path};

#[tauri::command]
fn makefile(filename: String, username: String, phone: String, email: String) -> String {
    let path = Path::new(&filename);
    let mut file = File::create(path).unwrap();

    file.write_all(
        format!(
            "Navn: {}\rTlf. nr.: {}\rEmail: {}\r
            ",
            username, phone, email
        )
        .as_bytes(),
    )
    .unwrap();

    let _file = match File::open(&path) {
        Err(why) => panic!("Kunne ikke åbne {}: {}", path.to_string_lossy(), why),
        Ok(file) => file,
    };
    filename
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![makefile])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
