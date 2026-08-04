import { createClient } from "@/lib/supabase/server";
import { Brand } from "@/components/Brand";
import { JournalForm } from "@/components/journal/JournalForm";

const SPILLOVER_UNLOCK_DAYS = 21;

export default async function JournalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("streak_current").eq("id", user.id).single();
  const { data: entries } = await supabase
    .from("journal_entries")
    .select("id, body, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const streak = profile?.streak_current ?? 0;
  const unlocked = streak >= SPILLOVER_UNLOCK_DAYS;
  const remaining = Math.max(0, SPILLOVER_UNLOCK_DAYS - streak);
  const pct = Math.min(100, (streak / SPILLOVER_UNLOCK_DAYS) * 100);

  return (
    <div className="view-journal">
      <header>
        <Brand />
      </header>
      <main>
        <section>
          <h1 className="page-title" style={{ marginTop: 6 }}>
            Daily reflection
          </h1>
          <p className="hint">How did today&apos;s training feel? One paragraph, before bed.</p>
          <JournalForm />
          {entries && entries.length > 0 ? (
            entries.map((e) => (
              <div key={e.id} className="j-entry">
                <p className="day">{new Date(e.created_at).toLocaleDateString()}</p>
                <p className="text">{e.body}</p>
              </div>
            ))
          ) : (
            <p className="hint" style={{ marginTop: 16 }}>
              No reflections yet — they&apos;ll show up here after your first entry.
            </p>
          )}
        </section>
        <section>
          <h2>Cognitive spillover</h2>
          {unlocked ? (
            <p className="hint">
              Unlocked — the discipline you built in sport is starting to show up in work, focus, and how you talk
              to yourself.
            </p>
          ) : (
            <div className="locked">
              <div className="lock-icon">🔒</div>
              <p>
                Unlocks after {SPILLOVER_UNLOCK_DAYS} days of consistency — when the discipline you built in sport
                starts showing up in work, focus, and how you talk to yourself.
              </p>
              <div className="progress-wrap">
                <div className="bar">
                  <div style={{ width: `${pct}%` }} />
                </div>
                <p>{remaining} more days of showing up</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
