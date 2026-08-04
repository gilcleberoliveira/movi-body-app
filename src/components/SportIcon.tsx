import type { Sport } from "@/lib/data/sports";

export function SportIcon({ sport }: { sport: Sport }) {
  return (
    <svg
      viewBox={sport.viewBox}
      fill="currentColor"
      stroke="none"
      // Trusted static content from src/lib/data/sports.ts — not user input.
      dangerouslySetInnerHTML={{ __html: sport.svg }}
    />
  );
}
