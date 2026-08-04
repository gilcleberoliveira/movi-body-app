"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { SPORTS, sportById } from "@/lib/data/sports";
import { SportIcon } from "@/components/SportIcon";
import { CheckIcon } from "@/components/icons";
import { checkIn } from "@/app/actions";
import { SEASON_LENGTH, seasonMeta } from "@/lib/data/protocolSteps";

const CHECKIN_MESSAGES = [
  "You showed up. That's the whole point today.",
  "That's one more vote for who you're becoming.",
  "No perfect workout needed. You just proved something to yourself.",
];
const WEEK_COMPLETE_MSG = "Seven days of proof. Your identity is listening.";
const NOT_YET_MSG = "You can check in later today — no rush.";

export type HomeInteractiveProps = {
  seasonCurrent: number;
  seasonCheckins: string[]; // sport_id per day, index 0 = day 1
  hasCheckedInToday: boolean;
  todaysSportId: string | null;
};

export function HomeInteractive({
  seasonCurrent,
  seasonCheckins,
  hasCheckedInToday,
  todaysSportId,
}: HomeInteractiveProps) {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();

  const season = seasonMeta(seasonCurrent)!;

  function showToast(text: string) {
    setToast(text);
    setTimeout(() => setToast(null), 2600);
  }

  function handlePick(sportId: string) {
    setSheetOpen(false);
    startTransition(async () => {
      const event = await checkIn(sportId);
      let msg = CHECKIN_MESSAGES[Math.floor(Math.random() * CHECKIN_MESSAGES.length)];
      if (event.weekComplete) msg = WEEK_COMPLETE_MSG;
      showToast(msg);
      if (event.seasonComplete && event.justDoneSeasonNumber) {
        setCelebration(event.justDoneSeasonNumber);
      }
      router.refresh();
    });
  }

  return (
    <>
      <section className="checkin">
        {hasCheckedInToday && todaysSportId ? (
          <div className="confirmed">
            <div className="check-badge">
              <CheckIcon />
            </div>
            <p className="title">You showed up today.</p>
            <p className="sport">Sport: {sportById(todaysSportId)?.label ?? todaysSportId}</p>
          </div>
        ) : (
          <>
            <span className="eyebrow">Daily check-in</span>
            <h1>Did you show up today?</h1>
            <p>No performance to judge. Just the promise you kept.</p>
            <div className="btns">
              <button className="pill primary" disabled={pending} onClick={() => setSheetOpen(true)}>
                Yes
              </button>
              <button className="pill outline" onClick={() => showToast(NOT_YET_MSG)}>
                Not yet
              </button>
            </div>
          </>
        )}
      </section>

      <section>
        <span className="season-eyebrow">
          SEASON {season.n} · {season.name.toUpperCase()}
        </span>
        <div className="streak-progress" style={{ marginTop: 8 }}>
          <div
            className="streak-progress-fill"
            style={{ width: `${(seasonCheckins.length / SEASON_LENGTH) * 100}%` }}
          />
        </div>
        <div className="streak-head">
          <div>
            <p className="streak-num">{seasonCheckins.length}</p>
            <p className="streak-label">Days you&apos;ve shown up</p>
          </div>
          <span className="streak-sub">
            {seasonCheckins.length}/{SEASON_LENGTH} · Season {season.n} of 3
          </span>
        </div>
        <div className="grid30">
          {Array.from({ length: SEASON_LENGTH }, (_, i) => {
            const sportId = seasonCheckins[i];
            const isToday = i === seasonCheckins.length;
            if (sportId) {
              const sport = sportById(sportId);
              return (
                <div key={i} className="cell done" title={sport?.label}>
                  {sport && <SportIcon sport={sport} />}
                </div>
              );
            }
            if (isToday) {
              return (
                <button key={i} className="cell today" onClick={() => setSheetOpen(true)}>
                  <span style={{ fontSize: 11 }}>+</span>
                </button>
              );
            }
            return <div key={i} className="cell" />;
          })}
        </div>
      </section>

      <div className={`overlay${sheetOpen ? " open" : ""}`} onClick={(e) => e.target === e.currentTarget && setSheetOpen(false)}>
        <div className="sheet">
          <div className="sheet-head">
            <h3>What did you do today?</h3>
            <button aria-label="Close" onClick={() => setSheetOpen(false)}>
              ✕
            </button>
          </div>
          <div className="sport-grid">
            {SPORTS.map((s) => (
              <button key={s.id} className="sport-btn" onClick={() => handlePick(s.id)}>
                <div className="sport-badge">
                  <SportIcon sport={s} />
                </div>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {celebration !== null && (
        <div className="overlay open celebrate-overlay">
          <div className="celebrate-card">
            <div className="celebrate-badge">🏁</div>
            <p className="celebrate-title">Season {celebration} is done.</p>
            <p className="celebrate-sub">You&apos;re not the same person who started it.</p>
            <button className="pill primary" onClick={() => setCelebration(null)}>
              Continue
            </button>
          </div>
        </div>
      )}

      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </>
  );
}
