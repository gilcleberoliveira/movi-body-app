"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, WallIcon, JournalIcon, DailyIcon, CommunityIcon, ProfileIcon } from "@/components/icons";
import { getChatLastSeen, onChatRead } from "@/lib/chatRead";

const ITEMS = [
  { href: "/home", label: "Home", Icon: HomeIcon, group: "home" },
  { href: "/wall", label: "Wall", Icon: WallIcon, group: "wall" },
  { href: "/journal", label: "Journal", Icon: JournalIcon, group: "journal" },
  { href: "/daily", label: "Daily", Icon: DailyIcon, group: "daily" },
  { href: "/community", label: "Community", Icon: CommunityIcon, group: "community" },
  { href: "/profile", label: "Profile", Icon: ProfileIcon, group: "profile" },
] as const;

export function BottomNav({ chatTimestamps = [] }: { chatTimestamps?: string[] }) {
  const pathname = usePathname();
  const isHomeGroup = pathname.startsWith("/protocol");
  const [unreadCount, setUnreadCount] = useState(chatTimestamps.length);

  useEffect(() => {
    function recompute() {
      const lastSeen = getChatLastSeen();
      setUnreadCount(lastSeen ? chatTimestamps.filter((t) => t > lastSeen).length : chatTimestamps.length);
    }
    recompute();
    return onChatRead(recompute);
  }, [chatTimestamps]);

  return (
    <nav>
      {ITEMS.map(({ href, label, Icon, group }) => {
        const active = pathname.startsWith(href) || (isHomeGroup && group === "home");
        const badge = group === "community" && unreadCount > 0 ? unreadCount : null;
        return (
          <Link key={href} href={href} className={active ? "active" : ""}>
            <span className="nav-icon-wrap">
              <Icon />
              {badge !== null && <span className="nav-badge">{badge > 99 ? "99+" : badge}</span>}
            </span>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
