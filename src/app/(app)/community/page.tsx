import { createClient } from "@/lib/supabase/server";
import { Brand } from "@/components/Brand";
import { ChatRoom } from "@/components/community/ChatRoom";
import { isoHoursAgo } from "@/lib/time";

export default async function CommunityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, avatar_initial")
    .eq("id", user.id)
    .single();

  const since = isoHoursAgo(24);
  const { data: messages } = await supabase
    .from("chat_messages")
    .select("*")
    .gte("created_at", since)
    .order("created_at", { ascending: true });

  return (
    <div className="view-community">
      <header>
        <Brand />
        <span className="chat-expiry-note" title="Messages disappear 24h after they're sent">
          24h
        </span>
      </header>
      <div className="chat-sub">Community room · everything here disappears after 24 hours</div>
      <ChatRoom
        userId={user.id}
        userName={profile?.name ?? "Member"}
        userInitial={profile?.avatar_initial ?? "M"}
        initialMessages={messages ?? []}
      />
    </div>
  );
}
