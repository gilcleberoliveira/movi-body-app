import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Brand } from "@/components/Brand";
import { PlusIcon } from "@/components/icons";
import { SEASON_LENGTH, seasonMeta } from "@/lib/data/protocolSteps";
import { mediaUrl } from "@/lib/media";

export default async function WallPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const seasonCurrent = profile?.season_current ?? 1;
  const season = seasonMeta(seasonCurrent)!;

  const { data: seasonCheckinsRaw } = await supabase
    .from("checkins")
    .select("sport_id, day_in_season, proof_id")
    .eq("user_id", user.id)
    .eq("season", seasonCurrent)
    .order("day_in_season", { ascending: true });

  const seasonCheckins = seasonCheckinsRaw ?? [];

  const proofIds = seasonCheckins.map((c) => c.proof_id).filter((id): id is string => !!id);
  const { data: proofsRaw } = proofIds.length
    ? await supabase.from("proofs").select("id, storage_path, kind").in("id", proofIds)
    : { data: [] as { id: string; storage_path: string; kind: string }[] };
  const proofById = new Map((proofsRaw ?? []).map((p) => [p.id, p]));

  return (
    <div className="view-wall">
      <header>
        <Brand />
        <span className="day">
          {seasonCheckins.length}/{SEASON_LENGTH} · Season {season.n} of 3
        </span>
      </header>
      <main>
        <h1 className="page-title">Proof-of-Identity Wall</h1>
        <p className="page-sub">
          Season {season.n} · {season.name} — no judgment on how it looks, only that you showed up.
        </p>
        <div className="w-grid">
          {Array.from({ length: SEASON_LENGTH }, (_, i) => {
            const dayLabel = `Day ${String(i + 1).padStart(2, "0")}`;
            const entry = seasonCheckins[i];
            if (entry) {
              const proof = entry.proof_id ? proofById.get(entry.proof_id) : null;
              const url = proof ? mediaUrl(proof.storage_path) : null;
              return (
                <div key={i} className="w-tile proof">
                  {url ? (
                    proof?.kind === "video" ? (
                      <video src={url} muted playsInline preload="metadata" />
                    ) : (
                      <Image src={url} alt="" width={140} height={140} unoptimized />
                    )
                  ) : (
                    <span>{dayLabel}</span>
                  )}
                </div>
              );
            }
            if (i === seasonCheckins.length) {
              return (
                <Link key={i} href="/home" className="w-tile add">
                  <PlusIcon />
                  <span>{dayLabel}</span>
                </Link>
              );
            }
            return (
              <div key={i} className="w-tile upcoming">
                <span>{dayLabel}</span>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
