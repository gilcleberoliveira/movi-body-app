type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function HomeIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

export function WallIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export function JournalIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5v-17z" />
      <line x1="4" y1="19" x2="20" y2="19" />
    </svg>
  );
}

export function DailyIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 3l1.8 5.3L19 10l-5.2 1.7L12 17l-1.8-5.3L5 10l5.2-1.7L12 3z" />
    </svg>
  );
}

export function CommunityIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="9" cy="8" r="3" />
      <path d="M2.5 20c1-3.5 3.5-5.3 6.5-5.3s5.5 1.8 6.5 5.3" />
      <circle cx="17.5" cy="7.5" r="2.3" />
      <path d="M15.8 14.8c2.3.3 3.9 1.9 4.7 4.5" />
    </svg>
  );
}

export function ProfileIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c1.4-3.7 4.2-5.6 7.5-5.6s6.1 1.9 7.5 5.6" />
    </svg>
  );
}

export function SettingsIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function CameraIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <circle cx="12" cy="13" r="3.5" />
      <path d="M8 6l1.5-2h5L16 6" />
    </svg>
  );
}

export function VideoIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="2.5" y="6" width="14" height="12" rx="2" />
      <path d="M16.5 10l5-3v10l-5-3z" />
    </svg>
  );
}

export function MicIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <line x1="12" y1="18" x2="12" y2="22" />
    </svg>
  );
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 3l1.8 5.3L19 10l-5.2 1.7L12 17l-1.8-5.3L5 10l5.2-1.7L12 3z" />
    </svg>
  );
}

export function TextIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  );
}

export function LockIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function HeartIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 21s-7.2-4.5-9.6-9C.9 8.6 2.3 5.3 5.6 5.3c1.9 0 3.2 1 4.4 2.6C11.2 6 12.5 5.3 14.4 5.3c3.3 0 4.7 3.3 3.2 6.7C15.2 16.5 12 21 12 21z" />
    </svg>
  );
}

export function BookmarkIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M6 3h12v18l-6-4-6 4V3z" />
    </svg>
  );
}

export function ShareIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="18" cy="5" r="2.6" />
      <circle cx="6" cy="12" r="2.6" />
      <circle cx="18" cy="19" r="2.6" />
      <line x1="8.3" y1="10.7" x2="15.7" y2="6.3" />
      <line x1="8.3" y1="13.3" x2="15.7" y2="17.7" />
    </svg>
  );
}

export function SendIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7z" />
    </svg>
  );
}

export function AttachIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <circle cx="12" cy="13" r="3.5" />
      <path d="M8 6l1.5-2h5L16 6" />
    </svg>
  );
}

export function BagIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

export function ClipboardIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="7" y="4" width="10" height="16" rx="2" />
      <rect x="9" y="2.3" width="6" height="3" rx="1" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 6.5 12 13 21 6.5" />
    </svg>
  );
}

export function ChatBubbleIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M4 12a8 8 0 1 1 3.2 6.4L4 20l1.3-3.6A7.96 7.96 0 0 1 4 12z" />
    </svg>
  );
}

export const SPORT_ICON_STROKE = 1.9;
