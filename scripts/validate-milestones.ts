// Deterministic validation for the milestone-based protocol (see
// AGENTS.md-equivalent spec: 18 milestones, 6 per season, exact days).
// Run with: npx tsx scripts/validate-milestones.ts
//
// This checks the static content contract. The double-checkin guard and
// data-preservation guarantees (old protocol_progress rows untouched) are
// enforced in src/app/actions.ts and the additive-only SQL migrations —
// they aren't re-checked here since this environment has no network path
// to a live Supabase database to exercise them against.

import { MILESTONES } from "../src/lib/data/milestones";

const REQUIRED_DAYS = [1, 3, 7, 14, 21, 30, 31, 35, 42, 49, 55, 60, 61, 67, 72, 78, 84, 90];

const failures: string[] = [];

function check(condition: boolean, message: string) {
  if (!condition) failures.push(message);
}

check(MILESTONES.length === 18, `Expected 18 milestones, found ${MILESTONES.length}`);

for (const season of [1, 2, 3]) {
  const count = MILESTONES.filter((m) => m.seasonNumber === season).length;
  check(count === 6, `Season ${season} should have 6 milestones, found ${count}`);
}

const days = MILESTONES.map((m) => m.day).sort((a, b) => a - b);
check(
  JSON.stringify(days) === JSON.stringify(REQUIRED_DAYS),
  `Milestone days ${JSON.stringify(days)} do not match required ${JSON.stringify(REQUIRED_DAYS)}`
);

const ids = MILESTONES.map((m) => m.id);
check(new Set(ids).size === ids.length, "Duplicate milestone ids found");
check(new Set(days).size === days.length, "Duplicate milestone days found");

for (const m of MILESTONES) {
  check(m.title.trim().length > 0, `Milestone ${m.id} has an empty title`);
  check(m.lesson.trim().length > 0, `Milestone ${m.id} has an empty lesson`);
  check(m.description.trim().length > 0, `Milestone ${m.id} has an empty description`);
  check(m.prompt.trim().length > 0, `Milestone ${m.id} has an empty prompt`);
  check(m.proofRequired === true, `Milestone ${m.id} must require proof`);
  check(m.estimatedMinutes > 0, `Milestone ${m.id} has a non-positive estimatedMinutes`);
  check(m.tags.length > 0, `Milestone ${m.id} has no tags`);
  check(
    m.day >= (m.seasonNumber - 1) * 30 + 1 && m.day <= m.seasonNumber * 30,
    `Milestone ${m.id} day ${m.day} is outside season ${m.seasonNumber}'s range`
  );
}

if (failures.length > 0) {
  console.error(`FAILED (${failures.length}):`);
  failures.forEach((f) => console.error(" -", f));
  process.exit(1);
}

console.log(`OK — 18 milestones, 6 per season, days match spec, no duplicates, all fields populated.`);
