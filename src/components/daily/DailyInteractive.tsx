"use client";

import { useState, useTransition } from "react";
import { HeartIcon, BookmarkIcon, ShareIcon } from "@/components/icons";
import { ShareSheet } from "@/components/daily/ShareSheet";
import { dailyMessageForDay, type DailyMessage } from "@/lib/data/dailyMessages";
import { toggleDailyInteraction } from "@/app/actions";

type Tab = "history" | "liked" | "saved" | "shared";

export type DailyInteractiveProps = {
  day: number;
  todayMessage: DailyMessage;
  todayInteraction: { liked: boolean; saved: boolean; shared: boolean };
  historyDays: number[];
  likedDays: number[];
  savedDays: number[];
  sharedDays: number[];
};

function entryHtml(m: DailyMessage, blurred: boolean, key: number) {
  return (
    <div key={key} className={`d-entry${blurred ? " blurred" : ""}`}>
      <div className="row">
        <span className="day">Day {m.day}</span>
        <span className="tag">{m.category}</span>
      </div>
      <p>{m.text}</p>
    </div>
  );
}

export function DailyInteractive({
  day,
  todayMessage,
  todayInteraction,
  historyDays,
  likedDays,
  savedDays,
  sharedDays,
}: DailyInteractiveProps) {
  const [tab, setTab] = useState<Tab>("history");
  const [liked, setLiked] = useState(todayInteraction.liked);
  const [saved, setSaved] = useState(todayInteraction.saved);
  const [shared, setShared] = useState(todayInteraction.shared);
  const [likedSet, setLikedSet] = useState(new Set(likedDays));
  const [savedSet, setSavedSet] = useState(new Set(savedDays));
  const [sharedSet, setSharedSet] = useState(new Set(sharedDays));
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [, startTransition] = useTransition();

  function toggle(field: "liked" | "saved") {
    const current = field === "liked" ? liked : saved;
    const next = !current;
    if (field === "liked") setLiked(next);
    if (field === "saved") setSaved(next);

    const setFn = field === "liked" ? setLikedSet : setSavedSet;
    setFn((prev) => {
      const copy = new Set(prev);
      if (next) copy.add(day);
      else copy.delete(day);
      return copy;
    });

    startTransition(async () => {
      await toggleDailyInteraction(day, field, next);
    });
  }

  function markShared() {
    setShared(true);
    setSharedSet((prev) => new Set(prev).add(day));
    startTransition(async () => {
      await toggleDailyInteraction(day, "shared", true);
    });
  }

  const activeSet = tab === "liked" ? likedSet : tab === "saved" ? savedSet : sharedSet;

  return (
    <>
      <div className="hero">
        <span className="tag">{todayMessage.category}</span>
        <p className="quote">{todayMessage.text}</p>
        <p className="prompt">Let that sit with you before today&apos;s session.</p>
        <span className="day">Day {day}</span>
        <div className="action-row">
          <button className={`action-btn${liked ? " active" : ""}`} onClick={() => toggle("liked")}>
            <HeartIcon />
            <span>Like</span>
          </button>
          <button className={`action-btn${saved ? " active" : ""}`} onClick={() => toggle("saved")}>
            <BookmarkIcon />
            <span>Save</span>
          </button>
          <button className={`action-btn${shared ? " active" : ""}`} onClick={() => setShareSheetOpen(true)}>
            <ShareIcon />
            <span>Share</span>
          </button>
        </div>
      </div>

      <ShareSheet
        open={shareSheetOpen}
        onClose={() => setShareSheetOpen(false)}
        text={todayMessage.text}
        onShared={markShared}
      />

      <div className="seg">
        {(["history", "liked", "saved", "shared"] as Tab[]).map((t) => (
          <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div>
        {tab === "history" &&
          (historyDays.length > 0 ? (
            historyDays.map((d) => {
              const m = dailyMessageForDay(d);
              return m ? entryHtml(m, true, d) : null;
            })
          ) : (
            <div className="empty">No previous days yet — check back tomorrow.</div>
          ))}

        {tab !== "history" &&
          (activeSet.size > 0 ? (
            Array.from(activeSet)
              .sort((a, b) => b - a)
              .map((d) => {
                const m = dailyMessageForDay(d);
                return m ? entryHtml(m, false, d) : null;
              })
          ) : (
            <div className="empty">
              Nothing here yet — tap {tab === "liked" ? "like" : tab === "saved" ? "save" : "share"} on a message to
              keep it.
            </div>
          ))}
      </div>
    </>
  );
}
