import type { Sport } from "@/lib/data/sports";

export function SportIcon({ sport, strokeWidth = 1.9 }: { sport: Sport; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      // Trusted static content from src/lib/data/sports.ts — not user input.
      dangerouslySetInnerHTML={{ __html: sport.svg }}
    />
  );
}
