import { createClient } from "@/lib/supabase/server";
import { Brand } from "@/components/Brand";
import { DailyInteractive } from "@/components/daily/DailyInteractive";
import { dailyMessageForDay, DAILY_MESSAGES } from "@/lib/data/dailyMessages";
import { daysSince } from "@/lib/time";

const MAX_DAY = DAILY_MESSAGES.length;

export default async function DailyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("created_at").eq("id", user.id).single();

  const elapsedDays = profile?.created_at ? daysSince(profile.created_at) : 0;
  const day = Math.min(MAX_DAY, Math.max(1, elapsedDays + 1));

  const { data: interactions } = await supabase
    .from("daily_interactions")
    .select("day, liked, saved, shared")
    .eq("user_id", user.id);

  const todayRow = interactions?.find((i) => i.day === day);
  const likedDays = (interactions ?? []).filter((i) => i.liked).map((i) => i.day);
  const savedDays = (interactions ?? []).filter((i) => i.saved).map((i) => i.day);
  const sharedDays = (interactions ?? []).filter((i) => i.shared).map((i) => i.day);

  const historyDays: number[] = [];
  for (let d = day - 1; d >= Math.max(1, day - 11); d--) historyDays.push(d);

  const todayMessage = dailyMessageForDay(day) ?? DAILY_MESSAGES[0];

  return (
    <div className="view-daily">
      <header>
        <Brand />
      </header>
      <main>
        <h1 className="page-title">Daily</h1>
        <p className="page-sub">
          One idea a day — mostly neuroscience, sometimes quantum mechanics, always about who you&apos;re becoming.
        </p>
        <DailyInteractive
          day={day}
          todayMessage={todayMessage}
          todayInteraction={{
            liked: todayRow?.liked ?? false,
            saved: todayRow?.saved ?? false,
            shared: todayRow?.shared ?? false,
          }}
          historyDays={historyDays}
          likedDays={likedDays}
          savedDays={savedDays}
          sharedDays={sharedDays}
        />
      </main>
    </div>
  );
}
