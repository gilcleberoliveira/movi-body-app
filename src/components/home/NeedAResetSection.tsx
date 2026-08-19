"use client";

import { useState, useTransition } from "react";
import { MISSION_STATES, missionsByState, type MissionState } from "@/lib/data/missions";
import { logMission } from "@/app/actions";

export function NeedAResetSection() {
  const [openState, setOpenState] = useState<MissionState | null>(null);
  const [activeMissionId, setActiveMissionId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function showToast(t: string) {
    setToast(t);
    setTimeout(() => setToast(null), 2200);
  }

  function close() {
    setOpenState(null);
    setActiveMissionId(null);
  }

  function complete(id: number) {
    startTransition(async () => {
      await logMission(id, "completed");
    });
    showToast("Logged — no streak impact either way.");
    close();
  }

  function abandon(id: number) {
    startTransition(async () => {
      await logMission(id, "abandoned");
    });
    close();
  }

  const missions = openState ? missionsByState(openState) : [];
  const activeMission = missions.find((m) => m.id === activeMissionId) ?? null;

  return (
    <section>
      <h2>Need a reset?</h2>
      <p className="page-sub" style={{ marginTop: 4, marginBottom: 12 }}>
        Optional, no streak impact — pick what&apos;s true right now.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {MISSION_STATES.map((s) => (
          <button key={s.id} className="view-all-btn" onClick={() => setOpenState(s.id)}>
            {s.label}
          </button>
        ))}
      </div>

      <div
        className={`overlay${openState ? " open" : ""}`}
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <div className="sheet">
          <div className="sheet-head">
            <h3>{activeMission ? activeMission.title : MISSION_STATES.find((s) => s.id === openState)?.label}</h3>
            <button aria-label="Close" onClick={close}>
              ✕
            </button>
          </div>
          {!activeMission ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {missions.map((m) => (
                <button key={m.id} className="share-row" onClick={() => setActiveMissionId(m.id)}>
                  <span className="label">{m.title}</span>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <p className="task-prompt">{activeMission.prompt}</p>
              <button
                className="pill primary"
                style={{ width: "100%", justifyContent: "center", marginTop: 14 }}
                onClick={() => complete(activeMission.id)}
              >
                Mark complete
              </button>
              <button
                className="pill outline"
                style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
                onClick={() => abandon(activeMission.id)}
              >
                Not now
              </button>
            </div>
          )}
        </div>
      </div>
      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </section>
  );
}
