import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Brand } from "@/components/Brand";
import { ArrowLeftIcon } from "@/components/icons";
import { StepTaskForm } from "@/components/protocol/StepTaskForm";
import { protocolStepById, PROTOCOL_STEPS } from "@/lib/data/protocolSteps";

export default async function ProtocolDetailPage({ params }: { params: Promise<{ stepId: string }> }) {
  const { stepId } = await params;
  const id = Number(stepId);
  const step = protocolStepById(id);
  if (!step) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: progress } = await supabase.from("protocol_progress").select("step_id").eq("user_id", user.id);
  const completed = new Set((progress ?? []).map((p) => p.step_id));
  const maxDone = completed.size ? Math.max(...completed) : 0;
  const isDone = completed.has(id);
  const isCurrent = id === maxDone + 1;

  if (!isDone && !isCurrent) redirect("/protocol");

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
          Step {String(step.id).padStart(2, "0")} / {PROTOCOL_STEPS.length}
        </p>
        <h2>{step.title}</h2>
        <p className="lesson">{step.lesson}</p>
        <StepTaskForm step={step} alreadyDone={isDone} />
      </main>
    </div>
  );
}
