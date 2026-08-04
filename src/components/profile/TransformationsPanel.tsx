"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { PlusIcon } from "@/components/icons";
import { addTransformation } from "@/app/actions";

export type Transformation = { id: string; body: string };

export function TransformationsPanel({ items }: { items: Transformation[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [, startTransition] = useTransition();

  function handleAdd() {
    const text = draft.trim();
    if (!text) return;
    startTransition(async () => {
      await addTransformation(text);
      setDraft("");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <div className="trans-head">
        <h2>Your transformations</h2>
        <button className="trans-add-btn" onClick={() => setOpen((v) => !v)}>
          <PlusIcon />
        </button>
      </div>
      {items.length === 0 && <p className="trans-empty">No transformations yet. They&apos;ll appear as you notice them.</p>}
      <ul className="trans">
        {items.map((t, i) => (
          <li key={t.id}>
            <span className="n">{String(i + 1).padStart(2, "0")}</span>
            {t.body}
          </li>
        ))}
      </ul>
      <div className={`add-row${open ? " open" : ""}`}>
        <input
          placeholder="Add another one…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button onClick={handleAdd}>+</button>
      </div>
    </>
  );
}
