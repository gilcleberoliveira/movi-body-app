import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Brand } from "@/components/Brand";
import { SportIcon } from "@/components/SportIcon";
import { StarIcon } from "@/components/icons";
import { sportById } from "@/lib/data/sports";
import { SEASONS, SEASON_LENGTH } from "@/lib/data/protocolSteps";
import { MILESTONES, globalDay } from "@/lib/data/milestones";

export default async function ProtocolMapPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("season_current, day_in_season").eq("id", user.id).single();
  const seasonCurrent = profile?.season_current ?? 1;
  const dayInSeason = profile?.day_in_season ?? 0;
  const currentGlobalDay = globalDay(seasonCurrent, dayInSeason);

  const { data: checkinsRaw } = await supabase
    .from("checkins")
    .select("sport_id, season, day_in_season")
    .eq("user_id", user.id);

  const checkinByGlobalDay = new Map(
    (checkinsRaw ?? []).map((c) => [globalDay(c.season, c.day_in_season), c.sport_id])
  );

  const { data: milestoneProgressRaw } = await supabase
    .from("milestone_progress")
    .select("milestone_id")
    .eq("user_id", user.id);
  const completedMilestones = new Set((milestoneProgressRaw ?? []).map((m) => m.milestone_id));

  const daysShownUp = checkinByGlobalDay.size;
  const pct = (daysShownUp / (SEASON_LENGTH * 3)) * 100;
  const season = SEASONS[seasonCurrent - 1];

  return (
    <div className="view-protocol-map">
      <header>
        <Brand />
        <span />
      </header>
      <main>
        <div className="protocol-header">
          <span className="eyebrow">The Protocol</span>
          <h1>90 days to a new identity.</h1>
          <p>
            Season {season.n} — {season.name}. {season.question}
          </p>
        </div>

        <div className="progress-row">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-count">{daysShownUp}/90 days</span>
        </div>
        <p className="page-sub" style={{ margin: "-14px 0 22px" }}>
          {completedMilestones.size}/{MILESTONES.length} milestones
        </p>

        {SEASONS.map((s) => (
          <section key={s.n} style={{ marginBottom: 28 }}>
            <p className="phase-heading" style={{ marginTop: 0 }}>
              Season {s.n} · {s.name} — {s.range}
            </p>
            <div className="grid30">
              {Array.from({ length: SEASON_LENGTH }, (_, i) => {
                const dInSeason = i + 1;
                const gDay = globalDay(s.n, dInSeason);
                const sportId = checkinByGlobalDay.get(gDay);
                const milestone = MILESTONES.find((m) => m.day === gDay);
                const isToday = gDay === currentGlobalDay + 1;

                if (milestone) {
                  const done = completedMilestones.has(milestone.id);
                  const reached = gDay <= currentGlobalDay;
                  const cellClass = `cell milestone${done ? " done" : ""}${isToday ? " today" : ""}`;
                  const content = sportId ? (
                    (() => {
                      const sport = sportById(sportId);
                      return sport ? <SportIcon sport={sport} /> : <StarIcon />;
                    })()
                  ) : (
                    <StarIcon />
                  );
                  if (reached) {
                    return (
                      <Link key={i} href={`/protocol/${milestone.id}`} className={cellClass} title={milestone.title}>
                        {content}
                      </Link>
                    );
                  }
                  return (
                    <div key={i} className={cellClass} title={milestone.title} style={{ opacity: 0.4 }}>
                      <StarIcon />
                    </div>
                  );
                }

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
                    <Link key={i} href="/home" className="cell today">
                      <span style={{ fontSize: 11 }}>+</span>
                    </Link>
                  );
                }

                return <div key={i} className="cell" />;
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
