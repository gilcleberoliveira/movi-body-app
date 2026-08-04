"use client";

import { useState } from "react";
import { SettingsIcon } from "@/components/icons";
import { SettingsSheet } from "@/components/profile/SettingsSheet";

export function SettingsButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="tools-btn" aria-label="Settings" onClick={() => setOpen(true)}>
        <SettingsIcon />
      </button>
      <SettingsSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}
