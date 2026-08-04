import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Brand } from "@/components/Brand";
import { CheckIcon, LockIcon, ArrowRightIcon } from "@/components/icons";
import { PROTOCOL_STEPS, seasonMeta } from "@/lib/data/protocolSteps";

export default async function ProtocolMapPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: progress } = await supabase.from("protocol_progress").select("step_id").eq("user_id", user.id);
  const completed = new Set((progress ?? []).map((p) => p.step_id));
  const maxDone = completed.size ? Math.max(...completed) : 0;

  function statusOf(id: number) {
    if (completed.has(id)) return "done";
    if (id === maxDone + 1) return "current";
    return "locked";
  }

  const pct = (completed.size / PROTOCOL_STEPS.length) * 100;

  const stepsWithHeadings = PROTOCOL_STEPS.reduce<{ step: (typeof PROTOCOL_STEPS)[number]; showHeading: boolean }[]>(
    (acc, step) => {
      const previousSeason = acc.length ? acc[acc.length - 1].step.season : 0;
      acc.push({ step, showHeading: step.season !== previousSeason });
      return acc;
    },
    []
  );

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
          <p>Season 1 — Sair da Inércia. One card per day, no skipping ahead.</p>
        </div>

        <div className="progress-row">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-count">
            {completed.size}/{PROTOCOL_STEPS.length}
          </span>
        </div>

        <div>
          {stepsWithHeadings.map(({ step, showHeading }) => {
            const status = statusOf(step.id);
            const seasonInfo = seasonMeta(step.season)!;

            const badgeContent =
              status === "done" ? <CheckIcon /> : status === "locked" ? <LockIcon /> : step.id;

            const card = (
              <div className={`step-card ${status}`}>
                <div className={`step-badge ${status}`}>{badgeContent}</div>
                <div className={`step-text${status === "locked" ? " blurred" : ""}`}>
                  <p className="step-meta">{step.type}</p>
                  <p className="step-title">{step.title}</p>
                  <p className="step-desc">{step.lesson}</p>
                </div>
                {status !== "locked" && (
                  <div className="step-arrow">
                    <ArrowRightIcon />
                  </div>
                )}
              </div>
            );

            return (
              <div key={step.id}>
                {showHeading && (
                  <p className="phase-heading">
                    Season {seasonInfo.n} · {seasonInfo.name}
                  </p>
                )}
                {status === "locked" ? card : <Link href={`/protocol/${step.id}`}>{card}</Link>}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
