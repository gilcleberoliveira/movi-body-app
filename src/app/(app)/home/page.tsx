import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Brand } from "@/components/Brand";
import { ArrowRightIcon, StarIcon } from "@/components/icons";
import { HomeInteractive } from "@/components/home/HomeInteractive";
import { NeedAResetSection } from "@/components/home/NeedAResetSection";
import { MILESTONES, globalDay } from "@/lib/data/milestones";
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
    .select("sport_id, day_in_season, proof_id, created_at")
    .eq("user_id", user.id)
    .eq("season", profile?.season_current ?? 1)
    .order("day_in_season", { ascending: true });

  const seasonCheckins = (seasonCheckinsRaw ?? []).map((c) => c.sport_id);
  const last = seasonCheckinsRaw?.[seasonCheckinsRaw.length - 1];
  const todayStr = todayDateString();
  const hasCheckedInToday = !!last && last.created_at.slice(0, 10) === todayStr;

  const { data: milestoneProgressRaw } = await supabase
    .from("milestone_progress")
    .select("milestone_id")
    .eq("user_id", user.id);
  const completedMilestoneIds = new Set((milestoneProgressRaw ?? []).map((m) => m.milestone_id));

  const currentGlobalDay = globalDay(profile?.season_current ?? 1, profile?.day_in_season ?? 0);
  const pendingMilestone = MILESTONES.find(
    (m) => m.day <= currentGlobalDay && !completedMilestoneIds.has(m.id)
  );

  const recentCheckinsWithProof = (seasonCheckinsRaw ?? [])
    .filter((c) => c.proof_id)
    .slice(-4)
    .reverse();

  const proofIds = recentCheckinsWithProof.map((c) => c.proof_id).filter((id): id is string => !!id);
  const { data: proofsRaw } = proofIds.length
    ? await supabase.from("proofs").select("id, storage_path, kind").in("id", proofIds)
    : { data: [] as { id: string; storage_path: string; kind: string }[] };
  const proofById = new Map((proofsRaw ?? []).map((p) => [p.id, p]));

  const totalMilestones = MILESTONES.length;
  const doneMilestones = completedMilestoneIds.size;
  const pct = totalMilestones ? (doneMilestones / totalMilestones) * 100 : 0;

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
              {doneMilestones}/{totalMilestones} milestones
            </p>
          </div>
          <div className="prog">
            <div className="ring" style={{ ["--pct" as string]: pct.toFixed(1) }}>
              <span>
                {doneMilestones}/{totalMilestones}
              </span>
            </div>
            <ArrowRightIcon className="arrow" />
          </div>
        </Link>

        {pendingMilestone && (
          <Link href={`/protocol/${pendingMilestone.id}`} className="protocol-card">
            <div className="left">
              <p className="k">
                <StarIcon className="k-star" />
                Milestone unlocked
              </p>
              <p className="v">{pendingMilestone.title}</p>
            </div>
            <ArrowRightIcon className="arrow" />
          </Link>
        )}

        <HomeInteractive
          userId={user.id}
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
            {recentCheckinsWithProof.length === 0 && (
              <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>
                No proofs yet — add one next time you check in.
              </p>
            )}
            {recentCheckinsWithProof.map((c) => {
              const proof = c.proof_id ? proofById.get(c.proof_id) : null;
              const url = proof ? mediaUrl(proof.storage_path) : null;
              if (!url) return null;
              return (
                <div key={c.day_in_season} className="tile proof">
                  {proof?.kind === "video" ? (
                    <video src={url} muted playsInline preload="metadata" />
                  ) : (
                    <Image src={url} alt="" width={78} height={78} unoptimized />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <NeedAResetSection />
      </main>
    </div>
  );
}
