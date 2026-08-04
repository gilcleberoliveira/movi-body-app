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

export function BottomNav() {
  const pathname = usePathname();
  const isHomeGroup = pathname.startsWith("/protocol");

  return (
    <nav>
      {ITEMS.map(({ href, label, Icon, group }) => {
        const active = pathname.startsWith(href) || (isHomeGroup && group === "home");
        return (
          <Link key={href} href={href} className={active ? "active" : ""}>
            <Icon />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
