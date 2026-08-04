import { createClient } from "@/lib/supabase/server";
import { Brand } from "@/components/Brand";
import { SettingsButton } from "@/components/profile/SettingsButton";
import { TransformationsPanel } from "@/components/profile/TransformationsPanel";
import { signOut } from "@/app/actions";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  const { count: proofsCount } = await supabase
    .from("protocol_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data: transformationsRaw } = await supabase
    .from("transformations")
    .select("id, body")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const name = profile?.name ?? "New member";
  const streakCurrent = profile?.streak_current ?? 0;
  const streakLongest = profile?.streak_longest ?? 0;

  return (
    <div className="view-profile">
      <header>
        <Brand />
        <SettingsButton />
      </header>
      <main>
        <div className="profile-head">
          <div className="avatar">{profile?.avatar_initial ?? "M"}</div>
          <div>
            <p className="name">{name}</p>
            <p className="email">{profile?.email ?? user.email}</p>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat">
            <p className="num">{streakCurrent}</p>
            <p className="label">Current</p>
          </div>
          <div className="stat">
            <p className="num">{streakLongest}</p>
            <p className="label">Longest</p>
          </div>
          <div className="stat">
            <p className="num">{proofsCount ?? 0}</p>
            <p className="label">Proofs</p>
          </div>
        </div>

        <div className="identity-card">
          <span className="eyebrow">Identity</span>
          <p className="sentence">You are someone who has shown up {streakCurrent} times. That starts today.</p>
        </div>

        <TransformationsPanel items={transformationsRaw ?? []} />

        <form action={signOut}>
          <button type="submit" className="signout">
            Sign out
          </button>
        </form>
      </main>
    </div>
  );
}
