import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/server";
import { isoHoursAgo } from "@/lib/time";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("chat_messages")
    .select("id", { count: "exact", head: true })
    .gte("created_at", isoHoursAgo(24));

  return (
    <div className="frame">
      {children}
      <BottomNav communityCount={count ?? 0} />
    </div>
  );
}
