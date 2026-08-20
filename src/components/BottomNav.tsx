"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, WallIcon, JournalIcon, DailyIcon, CommunityIcon, ProfileIcon } from "@/components/icons";

const ITEMS = [
  { href: "/home", label: "Home", Icon: HomeIcon, group: "home" },
  { href: "/wall", label: "Wall", Icon: WallIcon, group: "wall" },
  { href: "/journal", label: "Journal", Icon: JournalIcon, group: "journal" },
  { href: "/daily", label: "Daily", Icon: DailyIcon, group: "daily" },
  { href: "/community", label: "Community", Icon: CommunityIcon, group: "community" },
  { href: "/profile", label: "Profile", Icon: ProfileIcon, group: "profile" },
] as const;

export function BottomNav({ communityCount = 0 }: { communityCount?: number }) {
  const pathname = usePathname();
  const isHomeGroup = pathname.startsWith("/protocol");

  return (
    <nav>
      {ITEMS.map(({ href, label, Icon, group }) => {
        const active = pathname.startsWith(href) || (isHomeGroup && group === "home");
        const badge = group === "community" && communityCount > 0 ? communityCount : null;
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
