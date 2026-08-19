import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Brand } from "@/components/Brand";
import { ArrowLeftIcon } from "@/components/icons";
import { MilestoneTaskForm } from "@/components/protocol/MilestoneTaskForm";
import { milestoneById, globalDay } from "@/lib/data/milestones";

export default async function MilestoneDetailPage({ params }: { params: Promise<{ milestoneId: string }> }) {
  const { milestoneId } = await params;
  const id = Number(milestoneId);
  const milestone = milestoneById(id);
  if (!milestone) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("season_current, day_in_season").eq("id", user.id).single();
  const currentGlobalDay = globalDay(profile?.season_current ?? 1, profile?.day_in_season ?? 0);

  const { data: existing } = await supabase
    .from("milestone_progress")
    .select("response_text")
    .eq("user_id", user.id)
    .eq("milestone_id", id)
    .maybeSingle();

  const reached = milestone.day <= currentGlobalDay;
  if (!reached && !existing) redirect("/protocol");

  return (
    <div className="view-protocol-detail">
      <header>
        <Brand />
        <span />
      </header>
      <main>
        <Link href="/protocol" className="back-btn">
          <ArrowLeftIcon />
          Back to protocol
        </Link>
        <p className="step-num">
          Season {milestone.seasonNumber} · Day {milestone.day} · Milestone {milestone.id}/18
        </p>
        <h2>{milestone.title}</h2>
        <p className="lesson">
          <strong>Why this matters.</strong> {milestone.lesson} {milestone.description}
        </p>
        <MilestoneTaskForm milestone={milestone} alreadyDone={!!existing} userId={user.id} />
      </main>
    </div>
  );
}
