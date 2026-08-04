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
    .select("sport_id, day_in_season, proof_id, created_at")
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

  const recentCheckinsWithProof = (seasonCheckinsRaw ?? [])
    .filter((c) => c.proof_id)
    .slice(-4)
    .reverse();

  const proofIds = recentCheckinsWithProof.map((c) => c.proof_id).filter((id): id is string => !!id);
  const { data: proofsRaw } = proofIds.length
    ? await supabase.from("proofs").select("id, storage_path, kind").in("id", proofIds)
    : { data: [] as { id: string; storage_path: string; kind: string }[] };
  const proofById = new Map((proofsRaw ?? []).map((p) => [p.id, p]));

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
      </main>
    </div>
  );
}
