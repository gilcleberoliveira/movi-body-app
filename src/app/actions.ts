"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { applyCheckIn, type ProfileGameState, type CheckInEvent } from "@/lib/game";
import { todayDateString } from "@/lib/time";
import { XP_MILESTONE_BONUS, XP_PER_LEVEL } from "@/lib/data/protocolSteps";
import { milestoneById } from "@/lib/data/milestones";

// ───────────────────────────── Auth ─────────────────────────────

export async function signUp(_prevState: unknown, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return { error: "Preencha nome, email e senha." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) return { error: error.message };

  if (!data.session) {
    return {
      error: null,
      message: "Conta criada! Confirme seu email (verifique a caixa de entrada) e depois faça login.",
    };
  }

  redirect("/home");
}

export async function signIn(_prevState: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: "Email ou senha inválidos." };

  redirect("/home");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// ───────────────────────────── Check-in ─────────────────────────────
// Note: media files are uploaded directly from the browser to Supabase
// Storage (see src/lib/uploadMedia.ts) — Vercel's Serverless Functions cap
// request bodies at ~4.5MB regardless of Next.js config, far too small for
// phone photos/videos, so these actions only ever receive a storage path.

export async function checkIn(
  formData: FormData
): Promise<{ error: string; event?: undefined } | { error: null; event: CheckInEvent }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const sportId = String(formData.get("sportId"));
    const proofPath = formData.get("proofPath");
    const proofKind = formData.get("proofKind");

    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (profileErr || !profile) return { error: "Profile not found" };

    // Guard against double-counting the same day (double-click, refresh, retry).
    const { data: lastCheckin } = await supabase
      .from("checkins")
      .select("created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (lastCheckin && lastCheckin.created_at.slice(0, 10) === todayDateString()) {
      return { error: "You've already checked in today." };
    }

    let proofId: string | null = null;
    if (typeof proofPath === "string" && proofPath && (proofKind === "photo" || proofKind === "video")) {
      const { data: proof, error: proofErr } = await supabase
        .from("proofs")
        .insert({ user_id: user.id, kind: proofKind, storage_path: proofPath })
        .select()
        .single();
      if (proofErr) return { error: proofErr.message };
      proofId = proof.id;
    }

    const state: ProfileGameState = {
      xp: profile.xp,
      level: profile.level,
      streak_current: profile.streak_current,
      streak_longest: profile.streak_longest,
      shields_available: profile.shields_available,
      checkins_this_week: profile.checkins_this_week,
      day_in_season: profile.day_in_season,
      season_current: profile.season_current,
    };

    const seasonBeforeCheckin = state.season_current;
    const dayBeforeCheckin = state.day_in_season;
    const { next, event } = applyCheckIn(state);

    const { error: checkinErr } = await supabase.from("checkins").insert({
      user_id: user.id,
      sport_id: sportId,
      season: seasonBeforeCheckin,
      day_in_season: dayBeforeCheckin + 1,
      proof_id: proofId,
    });
    if (checkinErr) return { error: checkinErr.message };

    const { error: updateErr } = await supabase.from("profiles").update(next).eq("id", user.id);
    if (updateErr) return { error: updateErr.message };

    revalidatePath("/home");
    revalidatePath("/wall");
    revalidatePath("/profile");

    return { error: null, event };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Unexpected error" };
  }
}

// ───────────────────────────── Journal ─────────────────────────────

export async function addJournalEntry(text: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  if (!text.trim()) return;

  const { error } = await supabase.from("journal_entries").insert({ user_id: user.id, body: text.trim() });
  if (error) throw new Error(error.message);

  revalidatePath("/journal");
}

// ───────────────────────────── Transformations ─────────────────────────────

export async function addTransformation(text: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  if (!text.trim()) return;

  const { error } = await supabase.from("transformations").insert({ user_id: user.id, body: text.trim() });
  if (error) throw new Error(error.message);

  revalidatePath("/profile");
}

// ───────────────────────────── Daily interactions ─────────────────────────────

export async function toggleDailyInteraction(
  day: number,
  field: "liked" | "saved" | "shared",
  value: boolean
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const patch: { user_id: string; day: number; liked?: boolean; saved?: boolean; shared?: boolean } = {
    user_id: user.id,
    day,
  };
  patch[field] = value;

  const { error } = await supabase.from("daily_interactions").upsert(patch, { onConflict: "user_id,day" });
  if (error) throw new Error(error.message);

  revalidatePath("/daily");
}

// ───────────────────────────── Protocol steps ─────────────────────────────

export async function completeMilestone(formData: FormData): Promise<{ error: string } | { error: null }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const milestoneId = Number(formData.get("milestoneId"));
    const milestone = milestoneById(milestoneId);
    if (!milestone) return { error: "Milestone not found" };

    const responseText = formData.get("responseText");
    const proofPath = formData.get("proofPath");

    let proofId: string | null = null;
    if (milestone.type !== "text" && typeof proofPath === "string" && proofPath) {
      const { data: proof, error: proofErr } = await supabase
        .from("proofs")
        .insert({ user_id: user.id, kind: milestone.type, storage_path: proofPath })
        .select()
        .single();
      if (proofErr) return { error: proofErr.message };
      proofId = proof.id;
    }

    const hasTextResponse = typeof responseText === "string" && responseText.trim().length > 0;
    if (milestone.type === "text" && !hasTextResponse) {
      return { error: "Write your response before completing this milestone." };
    }
    if (milestone.type !== "text" && !proofId) {
      return { error: "Add your proof before completing this milestone." };
    }

    const { data: existing } = await supabase
      .from("milestone_progress")
      .select("id")
      .eq("user_id", user.id)
      .eq("milestone_id", milestoneId)
      .maybeSingle();

    const { error } = await supabase.from("milestone_progress").upsert(
      {
        user_id: user.id,
        milestone_id: milestoneId,
        response_text: hasTextResponse ? (responseText as string) : null,
        proof_id: proofId,
      },
      { onConflict: "user_id,milestone_id" }
    );
    if (error) return { error: error.message };

    if (!existing) {
      const { data: profile } = await supabase.from("profiles").select("xp").eq("id", user.id).single();
      if (profile) {
        const xp = profile.xp + XP_MILESTONE_BONUS;
        await supabase
          .from("profiles")
          .update({ xp, level: Math.floor(xp / XP_PER_LEVEL) + 1 })
          .eq("id", user.id);
      }
    }

    revalidatePath("/protocol");
    revalidatePath(`/protocol/${milestoneId}`);
    revalidatePath("/home");
    revalidatePath("/wall");
    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Unexpected error" };
  }
}

// ───────────────────────────── Missions ("Need a reset?") ─────────────────────────────

export async function logMission(missionId: number, status: "completed" | "abandoned") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("mission_log").insert({ user_id: user.id, mission_id: missionId, status });
  if (error) throw new Error(error.message);
}

// ───────────────────────────── Community chat ─────────────────────────────

export async function sendChatMessage(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, avatar_initial")
    .eq("id", user.id)
    .single();

  const body = formData.get("body");
  const mediaPath = formData.get("mediaPath");
  const kind = typeof mediaPath === "string" && mediaPath ? "media" : "text";

  if (kind === "text" && (!body || String(body).trim() === "")) return;

  const { error } = await supabase.from("chat_messages").insert({
    user_id: user.id,
    name: profile?.name ?? "Member",
    initial: profile?.avatar_initial ?? "M",
    kind,
    body: typeof body === "string" && body ? body : null,
    storage_path: typeof mediaPath === "string" && mediaPath ? mediaPath : null,
  });
  if (error) throw new Error(error.message);
}

// ───────────────────────────── Settings ─────────────────────────────

export async function updateProfileName(name: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  if (!name.trim()) return;

  const { error } = await supabase
    .from("profiles")
    .update({ name: name.trim(), avatar_initial: name.trim()[0]?.toUpperCase() ?? "M" })
    .eq("id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/profile");
}
