import { SEASON_LENGTH, XP_PER_LEVEL, XP_PER_CHECKIN, XP_WEEK_BONUS, XP_SEASON_BONUS, seasonMeta } from "@/lib/data/protocolSteps";

export type ProfileGameState = {
  xp: number;
  level: number;
  streak_current: number;
  streak_longest: number;
  shields_available: number;
  checkins_this_week: number;
  day_in_season: number;
  season_current: number;
};

export type CheckInEvent = {
  weekComplete: boolean;
  seasonComplete: boolean;
  justDoneSeasonNumber: number | null;
};

export function applyCheckIn(state: ProfileGameState): { next: ProfileGameState; event: CheckInEvent } {
  const next: ProfileGameState = { ...state };
  const event: CheckInEvent = { weekComplete: false, seasonComplete: false, justDoneSeasonNumber: null };

  next.xp += XP_PER_CHECKIN;
  next.streak_current += 1;
  next.streak_longest = Math.max(next.streak_longest, next.streak_current);
  next.checkins_this_week += 1;
  next.day_in_season += 1;

  if (next.checkins_this_week >= 7) {
    next.checkins_this_week = 0;
    next.xp += XP_WEEK_BONUS;
    next.shields_available = Math.min(3, next.shields_available + 1);
    event.weekComplete = true;
  }

  if (next.day_in_season > SEASON_LENGTH) {
    event.justDoneSeasonNumber = next.season_current;
    next.xp += XP_SEASON_BONUS;
    if (next.season_current < 3) {
      next.season_current += 1;
      next.day_in_season = 1;
    } else {
      next.day_in_season = SEASON_LENGTH;
    }
    event.seasonComplete = true;
  }

  next.level = Math.floor(next.xp / XP_PER_LEVEL) + 1;

  return { next, event };
}

export { seasonMeta };
