"use client";

import { useSyncExternalStore } from "react";

const LANGS = [
  "English",
  "普通话 (Mandarin Chinese)",
  "हिन्दी (Hindi)",
  "Español (Spanish)",
  "Français (French)",
  "العربية (Arabic)",
  "বাংলা (Bengali)",
  "Português (Portuguese)",
  "Русский (Russian)",
  "اردو (Urdu)",
];

function subscribeToThemeClass(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function getIsDark() {
  return document.documentElement.classList.contains("dark-bg");
}

function getIsDarkServerSnapshot() {
  return false;
}

export function SettingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dark = useSyncExternalStore(subscribeToThemeClass, getIsDark, getIsDarkServerSnapshot);

  function setTheme(isDark: boolean) {
    document.documentElement.classList.toggle("dark-bg", isDark);
    try {
      localStorage.setItem("movi-theme", isDark ? "dark" : "light");
    } catch {}
  }

  return (
    <div className={`overlay${open ? " open" : ""}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sheet-head">
          <h3>Settings</h3>
          <button aria-label="Close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="settings-row">
          <label>Language</label>
          <select defaultValue="English">
            {LANGS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>

        <div className="settings-row">
          <label>Background</label>
          <div className="bg-toggle">
            <button className={!dark ? "active" : ""} onClick={() => setTheme(false)}>
              <span className="bg-swatch" style={{ background: "#f2f2eb" }} />
              White
            </button>
            <button className={dark ? "active" : ""} onClick={() => setTheme(true)}>
              <span className="bg-swatch" style={{ background: "#0d0d0d" }} />
              Black
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
