"use client";

import { useState } from "react";

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

function currentTheme(): "dark" | "light" {
  return document.documentElement.classList.contains("dark-bg") ? "dark" : "light";
}

function currentLanguage(): string {
  try {
    return localStorage.getItem("movi-lang") ?? "English";
  } catch {
    return "English";
  }
}

export function SettingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [draftDark, setDraftDark] = useState(false);
  const [draftLang, setDraftLang] = useState("English");
  const [prevOpen, setPrevOpen] = useState(open);

  // Re-stage the sheet's inputs from the currently-applied settings each time it opens
  // (adjusting state during render, per https://react.dev/learn/you-might-not-need-an-effect).
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setDraftDark(currentTheme() === "dark");
      setDraftLang(currentLanguage());
    }
  }

  function handleConfirm() {
    document.documentElement.classList.toggle("dark-bg", draftDark);
    try {
      localStorage.setItem("movi-theme", draftDark ? "dark" : "light");
      localStorage.setItem("movi-lang", draftLang);
    } catch {}
    onClose();
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
          <select value={draftLang} onChange={(e) => setDraftLang(e.target.value)}>
            {LANGS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>

        <div className="settings-row">
          <label>Background</label>
          <div className="bg-toggle">
            <button className={!draftDark ? "active" : ""} onClick={() => setDraftDark(false)}>
              <span className="bg-swatch" style={{ background: "#f2f2eb" }} />
              White
            </button>
            <button className={draftDark ? "active" : ""} onClick={() => setDraftDark(true)}>
              <span className="bg-swatch" style={{ background: "#0d0d0d" }} />
              Black
            </button>
          </div>
        </div>

        <button className="pill primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
}
