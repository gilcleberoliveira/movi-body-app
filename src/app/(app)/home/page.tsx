import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Brand } from "@/components/Brand";
import { ArrowRightIcon } from "@/components/icons";
import { HomeInteractive } from "@/components/home/HomeInteractive";
import { PROTOCOL_STEPS } from "@/lib/data/protocolSteps";
import { mediaUrl } from "@/lib/media";
import { todayDateString } from "@/lib/time";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  const { data: seasonCheckinsRaw } = await supabase
    .from("checkins")
    .select("sport_id, day_in_season, created_at")
    .eq("user_id", user.id)
    .eq("season", profile?.season_current ?? 1)
    .order("day_in_season", { ascending: true });

  const seasonCheckins = (seasonCheckinsRaw ?? []).map((c) => c.sport_id);
  const last = seasonCheckinsRaw?.[seasonCheckinsRaw.length - 1];
  const todayStr = todayDateString();
  const hasCheckedInToday = !!last && last.created_at.slice(0, 10) === todayStr;

  const { count: completedSteps } = await supabase
    .from("protocol_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data: recentProgressRaw } = await supabase
    .from("protocol_progress")
    .select("step_id, completed_at, proof_id")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(4);

  const proofIds = (recentProgressRaw ?? []).map((p) => p.proof_id).filter((id): id is string => !!id);
  const { data: proofsRaw } = proofIds.length
    ? await supabase.from("proofs").select("id, storage_path").in("id", proofIds)
    : { data: [] as { id: string; storage_path: string }[] };
  const proofById = new Map((proofsRaw ?? []).map((p) => [p.id, p.storage_path]));

  const totalSteps = PROTOCOL_STEPS.length;
  const done = completedSteps ?? 0;
  const pct = totalSteps ? (done / totalSteps) * 100 : 0;

  return (
    <div className="view-home">
      <header>
        <Brand />
        <span className="day">Day {profile?.day_in_season ?? 0}</span>
      </header>
      <main>
        <Link href="/protocol" className="protocol-card">
          <div className="left">
            <p className="k">Your protocol</p>
            <p className="v">
              Sair da Inércia — {done}/{totalSteps} unlocked
            </p>
          </div>
          <div className="prog">
            <div className="ring" style={{ ["--pct" as string]: pct.toFixed(1) }}>
              <span>
                {done}/{totalSteps}
              </span>
            </div>
            <ArrowRightIcon className="arrow" />
          </div>
        </Link>

        <HomeInteractive
          seasonCurrent={profile?.season_current ?? 1}
          seasonCheckins={seasonCheckins}
          hasCheckedInToday={hasCheckedInToday}
          todaysSportId={hasCheckedInToday ? last?.sport_id ?? null : null}
        />

        <section>
          <div className="row-head">
            <h2>Proof-of-Identity Wall</h2>
            <Link href="/wall" className="view-all-btn">
              View all <ArrowRightIcon />
            </Link>
          </div>
          <div className="hscroll">
            {(recentProgressRaw ?? []).map((p) => {
              const storagePath = p.proof_id ? proofById.get(p.proof_id) : null;
              const url = storagePath ? mediaUrl(storagePath) : null;
              return (
                <div key={p.step_id} className="tile proof">
                  {url ? (
                    <Image src={url} alt="" width={78} height={78} unoptimized />
                  ) : (
                    <span>Step {p.step_id}</span>
                  )}
                </div>
              );
            })}
            <Link href="/protocol" className="tile add">
              +<span>Add proof</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
