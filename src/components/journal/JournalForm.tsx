"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { addJournalEntry } from "@/app/actions";

export function JournalForm() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLTextAreaElement>(null);

  function handleSave() {
    const text = value.trim();
    if (!text) return;
    startTransition(async () => {
      await addJournalEntry(text);
      setValue("");
      router.refresh();
    });
  }

  return (
    <>
      <textarea
        ref={ref}
        rows={3}
        placeholder="Write the truth of how it felt…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button className="save" onClick={handleSave} disabled={pending || !value.trim()}>
        {pending ? "Saving…" : "Save tonight's entry"}
      </button>
    </>
  );
}
