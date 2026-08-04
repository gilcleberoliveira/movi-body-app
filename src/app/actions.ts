"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { applyCheckIn, type ProfileGameState } from "@/lib/game";

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

// ───────────────────────────── Storage ─────────────────────────────

async function uploadMedia(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  file: File
): Promise<string> {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type || undefined,
  });
  if (error) throw new Error(error.message);
  return path;
}

// ───────────────────────────── Check-in ─────────────────────────────

export async function checkIn(sportId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (profileErr || !profile) throw new Error("Profile not found");

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
  });
  if (checkinErr) throw new Error(checkinErr.message);

  const { error: updateErr } = await supabase.from("profiles").update(next).eq("id", user.id);
  if (updateErr) throw new Error(updateErr.message);

  revalidatePath("/home");
  revalidatePath("/wall");
  revalidatePath("/profile");

  return event;
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

export async function completeProtocolStep(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const stepId = Number(formData.get("stepId"));
  const type = String(formData.get("type"));
  const responseText = formData.get("responseText");
  const file = formData.get("file");

  let proofId: string | null = null;

  if ((type === "photo" || type === "video") && file instanceof File && file.size > 0) {
    const path = await uploadMedia(supabase, user.id, file);
    const { data: proof, error: proofErr } = await supabase
      .from("proofs")
      .insert({ user_id: user.id, kind: type as "photo" | "video", storage_path: path })
      .select()
      .single();
    if (proofErr) throw new Error(proofErr.message);
    proofId = proof.id;
  }

  const { error } = await supabase.from("protocol_progress").upsert(
    {
      user_id: user.id,
      step_id: stepId,
      response_text: typeof responseText === "string" && responseText ? responseText : null,
      proof_id: proofId,
    },
    { onConflict: "user_id,step_id" }
  );
  if (error) throw new Error(error.message);

  revalidatePath("/protocol");
  revalidatePath(`/protocol/${stepId}`);
  revalidatePath("/home");
  revalidatePath("/wall");
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
  const file = formData.get("file");
  const kind = file instanceof File && file.size > 0 ? "media" : "text";

  let storagePath: string | null = null;
  if (kind === "media" && file instanceof File) {
    storagePath = await uploadMedia(supabase, user.id, file);
  }

  if (kind === "text" && (!body || String(body).trim() === "")) return;

  const { error } = await supabase.from("chat_messages").insert({
    user_id: user.id,
    name: profile?.name ?? "Member",
    initial: profile?.avatar_initial ?? "M",
    kind,
    body: typeof body === "string" && body ? body : null,
    storage_path: storagePath,
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
