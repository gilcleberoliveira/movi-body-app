import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/server";
import { isoHoursAgo } from "@/lib/time";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: recentMessages } = await supabase
    .from("chat_messages")
    .select("created_at")
    .gte("created_at", isoHoursAgo(24));

  return (
    <div className="frame">
      {children}
      <BottomNav chatTimestamps={(recentMessages ?? []).map((m) => m.created_at)} />
    </div>
  );
}
