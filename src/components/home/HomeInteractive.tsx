"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SPORTS, sportById } from "@/lib/data/sports";
import { SportIcon } from "@/components/SportIcon";
import { CheckIcon, ArrowLeftIcon, CameraIcon } from "@/components/icons";
import { checkIn } from "@/app/actions";
import { uploadMediaFromBrowser } from "@/lib/uploadMedia";
import { SEASON_LENGTH, seasonMeta } from "@/lib/data/protocolSteps";

const CHECKIN_MESSAGES = [
  "You showed up. That's the whole point today.",
  "That's one more vote for who you're becoming.",
  "No perfect workout needed. You just proved something to yourself.",
];
const WEEK_COMPLETE_MSG = "Seven days of proof. Your identity is listening.";
const NOT_YET_MSG = "You can check in later today — no rush.";

export type HomeInteractiveProps = {
  userId: string;
  seasonCurrent: number;
  seasonCheckins: string[]; // sport_id per day, index 0 = day 1
  hasCheckedInToday: boolean;
  todaysSportId: string | null;
};

export function HomeInteractive({
  userId,
  seasonCurrent,
  seasonCheckins,
  hasCheckedInToday,
  todaysSportId,
}: HomeInteractiveProps) {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedSportId, setSelectedSportId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const season = seasonMeta(seasonCurrent)!;
  const selectedSport = selectedSportId ? sportById(selectedSportId) : null;

  function showToast(text: string) {
    setToast(text);
    setTimeout(() => setToast(null), 2600);
  }

  function closeSheet() {
    setSheetOpen(false);
    setSelectedSportId(null);
    setError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
  }

  function handleFilePick(f: File | null) {
    setFile(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
  }

  function handleConfirm() {
    if (!selectedSportId || pending) return;
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("sportId", selectedSportId);
      if (file) {
        try {
          const uploaded = await uploadMediaFromBrowser(userId, file);
          formData.set("proofPath", uploaded.path);
          formData.set("proofKind", uploaded.kind);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Upload failed. Please try again.");
          return;
        }
      }
      const result = await checkIn(formData);
      if (result.error !== null) {
        setError(result.error);
        return;
      }
      closeSheet();
      let msg = CHECKIN_MESSAGES[Math.floor(Math.random() * CHECKIN_MESSAGES.length)];
      if (result.event.weekComplete) msg = WEEK_COMPLETE_MSG;
      showToast(msg);
      if (result.event.seasonComplete && result.event.justDoneSeasonNumber) {
        setCelebration(result.event.justDoneSeasonNumber);
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

      <div className={`overlay${sheetOpen ? " open" : ""}`} onClick={(e) => e.target === e.currentTarget && closeSheet()}>
        <div className="sheet">
          {!selectedSport ? (
            <>
              <div className="sheet-head">
                <h3>What did you do today?</h3>
                <button aria-label="Close" onClick={closeSheet}>
                  ✕
                </button>
              </div>
              <div className="sport-grid">
                {SPORTS.map((s) => (
                  <button key={s.id} className="sport-btn" onClick={() => setSelectedSportId(s.id)}>
                    <div className="sport-badge">
                      <SportIcon sport={s} />
                    </div>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="sheet-head">
                <button className="back-btn" style={{ margin: 0 }} onClick={() => setSelectedSportId(null)}>
                  <ArrowLeftIcon />
                  {selectedSport.label}
                </button>
                <button aria-label="Close" onClick={closeSheet}>
                  ✕
                </button>
              </div>
              <div className="task-box">
                <div className="task-label">
                  <CameraIcon />
                  <span>Add a proof (optional)</span>
                </div>
                <p className="task-prompt">A photo or video for the Wall — or just check in without one.</p>
                <div className="upload-box" onClick={() => fileInputRef.current?.click()}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => handleFilePick(e.target.files?.[0] ?? null)}
                  />
                  <CameraIcon />
                  <span className="u-label">{file ? "Attached ✓" : "Tap to add a photo or video"}</span>
                  {previewUrl && file?.type.startsWith("image/") && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrl} alt="" className="upload-preview" />
                  )}
                </div>
                <button className="pill primary" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} disabled={pending} onClick={handleConfirm}>
                  {pending ? "Checking in…" : "Check in"}
                </button>
                {error && <p className="form-error">{error}</p>}
              </div>
            </>
          )}
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
