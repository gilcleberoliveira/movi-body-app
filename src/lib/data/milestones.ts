import { SEASONS, SEASON_LENGTH } from "@/lib/data/protocolSteps";

export type MilestoneType = "photo" | "video" | "text" | "audio";

export type Milestone = {
  id: number;
  day: number; // day across the full 90-day journey (1-90)
  seasonNumber: number;
  season: string;
  title: string;
  lesson: string;
  description: string;
  prompt: string;
  type: MilestoneType;
  proofRequired: true;
  estimatedMinutes: number;
  tags: string[];
  charLimit?: number;
};

export const MILESTONES: Milestone[] = [
  // Season 1 — Stop Negotiating
  {
    id: 1,
    day: 1,
    seasonNumber: 1,
    season: "Stop Negotiating",
    title: "The Person You Are Today",
    lesson:
      "Who are you being — not who you want to be, but who you actually are right now. Before anything changes, you have to name where you're starting from, without flattering yourself and without punishing yourself either.",
    description: "This is the baseline the rest of the 90 days gets measured against — not a performance, just an honest snapshot.",
    prompt:
      "Write two short paragraphs in a notebook: who you are today, in detail, and who you're becoming, in detail. Upload a photo of the page — blur the text if you want privacy, the proof is that you wrote it.",
    type: "photo",
    proofRequired: true,
    estimatedMinutes: 15,
    tags: ["identity", "reflection"],
  },
  {
    id: 2,
    day: 3,
    seasonNumber: 1,
    season: "Stop Negotiating",
    title: "The Invisible Prison",
    lesson:
      "Shame, judgment, comparison, fear, the voice in your head — that's the real prison, not your schedule or your body. Salvation here is individual. No one is coming to do this for you.",
    description: "The first action outside your avoidance zone breaks a pattern that talking about it never will.",
    prompt:
      "Leave the house today — not next Monday, today. Go to a trial class, or train outdoors if that's your thing. Do it alone, tell no one beforehand. Record a short clip as your only proof.",
    type: "video",
    proofRequired: true,
    estimatedMinutes: 20,
    tags: ["action", "avoidance"],
  },
  {
    id: 3,
    day: 7,
    seasonNumber: 1,
    season: "Stop Negotiating",
    title: "Shoes On, Debate Over",
    lesson: "Motivation shows up after you start, not before. A ritual removes the moment where negotiation happens.",
    description: "The point isn't the workout — it's building a two-minute sequence your body runs on autopilot before you can talk yourself out of it.",
    prompt:
      "Build a minimal transition ritual — the exact sequence of moves that gets you from 'thinking about it' to 'out the door.' Photograph the moment right before you leave.",
    type: "photo",
    proofRequired: true,
    estimatedMinutes: 10,
    tags: ["ritual", "friction"],
  },
  {
    id: 4,
    day: 14,
    seasonNumber: 1,
    season: "Stop Negotiating",
    title: "The Bad Session Counts",
    lesson:
      "A session that's short, slow, or half-hearted still teaches your brain that you're someone who shows up. Quality isn't the metric here — repetition is.",
    description: "Pick a day you don't feel like training and do a deliberately smaller version of it anyway.",
    prompt: "On a day you don't want to, show up for a lighter version of your usual session. Record a short clip afterward and say one honest sentence about how it felt.",
    type: "video",
    proofRequired: true,
    estimatedMinutes: 15,
    tags: ["consistency", "resistance"],
  },
  {
    id: 5,
    day: 21,
    seasonNumber: 1,
    season: "Stop Negotiating",
    title: "The Five-Minute Contract",
    lesson: "You don't need a full session to keep the promise — you need five real minutes, with permission to stop after.",
    description: "This removes the all-or-nothing trap: no more skipping because you don't have an hour.",
    prompt: "Do exactly five minutes of movement, with no obligation to continue. Time it and upload a screenshot or photo of the clock.",
    type: "photo",
    proofRequired: true,
    estimatedMinutes: 5,
    tags: ["minimum-viable", "permission"],
  },
  {
    id: 6,
    day: 30,
    seasonNumber: 1,
    season: "Stop Negotiating",
    title: "First Season Receipt",
    lesson: "Thirty days in, the proof is already there — you just haven't looked at it as a pattern yet.",
    description: "Close the season by reviewing three early proofs and naming, out loud, what actually changed.",
    prompt: "Look back at three of your earliest proofs. Record a short voice note describing what's different now, then upload it with a photo collage of those three moments.",
    type: "audio",
    proofRequired: true,
    estimatedMinutes: 15,
    tags: ["review", "season-close"],
  },

  // Season 2 — Gather Proof
  {
    id: 7,
    day: 31,
    seasonNumber: 2,
    season: "Gather Proof",
    title: "Build the Cue Stack",
    lesson: "Habits attach to other habits, not to willpower. Movement needs a trigger that already happens every day.",
    description: "Pick something you already do without thinking — coffee, commute, brushing your teeth — and chain your movement to it.",
    prompt: "Write down the one existing routine you'll attach today's movement to, and why you picked it.",
    type: "text",
    proofRequired: true,
    estimatedMinutes: 10,
    tags: ["habit", "routine"],
    charLimit: 400,
  },
  {
    id: 8,
    day: 35,
    seasonNumber: 2,
    season: "Gather Proof",
    title: "The Route With an Exit",
    lesson: "All-or-nothing plans collapse the first time life gets in the way. A plan with a built-in exit survives bad days.",
    description: "Design a version of your routine that has an easy, guilt-free off-ramp instead of demanding perfection.",
    prompt: "Sketch or write a simple plan for the next two weeks that includes a safe, smaller fallback option. Upload a photo of it.",
    type: "photo",
    proofRequired: true,
    estimatedMinutes: 15,
    tags: ["planning", "sustainability"],
  },
  {
    id: 9,
    day: 42,
    seasonNumber: 2,
    season: "Gather Proof",
    title: "The Failed Plan",
    lesson: "A plan that didn't survive contact with real life isn't proof you failed — it's data. Redesign it instead of abandoning the identity behind it.",
    description: "Look at where your plan actually broke, and rebuild the part that didn't work.",
    prompt: "Write a short before/after: the plan that failed, and the adjusted version you're trying instead.",
    type: "text",
    proofRequired: true,
    estimatedMinutes: 15,
    tags: ["adaptation", "resilience"],
    charLimit: 500,
  },
  {
    id: 10,
    day: 49,
    seasonNumber: 2,
    season: "Gather Proof",
    title: "The Quiet Win",
    lesson: "If your effort only counts when someone's watching, it isn't really yours yet. Prove it works with no audience at all.",
    description: "Complete a session today and tell no one — don't post it, don't mention it. Just know it happened.",
    prompt: "Do your movement for today without posting or telling anyone. Save your proof privately here — it stays yours.",
    type: "photo",
    proofRequired: true,
    estimatedMinutes: 20,
    tags: ["privacy", "intrinsic"],
  },
  {
    id: 11,
    day: 55,
    seasonNumber: 2,
    season: "Gather Proof",
    title: "The Community Reply",
    lesson: "Showing up for someone else's hard day is its own kind of proof — that you're far enough along to hold space for someone behind you.",
    description: "Find one person in the community who's struggling or celebrating, and respond with something specific, not generic.",
    prompt: "Reply to someone in the community with a specific, honest response — not just an emoji. Paste what you said.",
    type: "text",
    proofRequired: true,
    estimatedMinutes: 10,
    tags: ["community", "support"],
    charLimit: 400,
  },
  {
    id: 12,
    day: 60,
    seasonNumber: 2,
    season: "Gather Proof",
    title: "Second Season Archive",
    lesson: "Patterns are easier to see backwards than forwards. Lay five proofs side by side and the shape of your consistency becomes obvious.",
    description: "Organize five proofs from this season in the order the change actually happened.",
    prompt: "Pick five proofs from the last 30 days and arrange them in order of change. Upload the collage with a short voice note on what you see.",
    type: "audio",
    proofRequired: true,
    estimatedMinutes: 15,
    tags: ["review", "season-close"],
  },

  // Season 3 — New Identity
  {
    id: 13,
    day: 61,
    seasonNumber: 3,
    season: "New Identity",
    title: "The Transformation List",
    lesson: "Focus, sleep, confidence, mood — something has shifted since day one. Most people let it go unnoticed. Name it instead.",
    description: "No clinical claims, just what you've actually observed in your own life.",
    prompt: "List ten changes you've noticed since you started — in your body, your routine, your relationships, anywhere.",
    type: "text",
    proofRequired: true,
    estimatedMinutes: 15,
    tags: ["transformation", "awareness"],
    charLimit: 700,
  },
  {
    id: 14,
    day: 67,
    seasonNumber: 3,
    season: "New Identity",
    title: "The Missed Day Protocol",
    lesson: "You will miss a day eventually. The question isn't whether — it's what happens the day after.",
    description: "Decide, in advance, exactly what you'll do the day after you break a streak, so it's a rule instead of a spiral.",
    prompt: "Write your personal rule for returning after a missed day — the exact next action, decided now, before you need it.",
    type: "text",
    proofRequired: true,
    estimatedMinutes: 10,
    tags: ["resilience", "identity"],
    charLimit: 400,
  },
  {
    id: 15,
    day: 72,
    seasonNumber: 3,
    season: "New Identity",
    title: "The Movement Menu",
    lesson: "One version of your routine can't survive every day — a brutal week, a great week, and a sick week all need a different answer.",
    description: "Build three versions of your session so there's always one you can actually do.",
    prompt: "Write your minimal, normal, and expanded versions of your movement routine — one sentence each.",
    type: "text",
    proofRequired: true,
    estimatedMinutes: 15,
    tags: ["flexibility", "sustainability"],
    charLimit: 500,
  },
  {
    id: 16,
    day: 78,
    seasonNumber: 3,
    season: "New Identity",
    title: "The Identity Sentence",
    lesson: "A sentence backed by ninety days of evidence hits differently than one you just hoped was true.",
    description: "Write the identity statement you've actually earned, then back it with a real proof.",
    prompt: "Write one sentence starting with 'I am someone who…' and upload a photo that proves it.",
    type: "photo",
    proofRequired: true,
    estimatedMinutes: 10,
    tags: ["identity", "proof"],
  },
  {
    id: 17,
    day: 84,
    seasonNumber: 3,
    season: "New Identity",
    title: "The Next Person",
    lesson: "You were a beginner ninety days ago. Someone else is a beginner right now — your job today is to listen, not to lecture.",
    description: "Find someone earlier in the process than you and just listen to where they're at.",
    prompt: "Talk to or read from someone newer than you. Record a short note on what you learned from listening — no advice-giving.",
    type: "audio",
    proofRequired: true,
    estimatedMinutes: 15,
    tags: ["community", "humility"],
  },
  {
    id: 18,
    day: 90,
    seasonNumber: 3,
    season: "New Identity",
    title: "Welcome to the Person",
    lesson: "You're not starting over on day 91 — you're choosing what comes next as someone who already knows how to show up.",
    description: "Close this 90-day arc by naming the next 30-day promise, on your own terms.",
    prompt: "Record a short video or voice note about what these 90 days actually did, then write the next 30-day promise you're making yourself.",
    type: "video",
    proofRequired: true,
    estimatedMinutes: 20,
    tags: ["completion", "next-chapter"],
  },
];

export function milestoneById(id: number): Milestone | undefined {
  return MILESTONES.find((m) => m.id === id);
}

export function milestoneByDay(day: number): Milestone | undefined {
  return MILESTONES.find((m) => m.day === day);
}

/** Global day (1-90) from a season number + day-within-season. */
export function globalDay(seasonNumber: number, dayInSeason: number): number {
  return (seasonNumber - 1) * SEASON_LENGTH + dayInSeason;
}

/** Season number (1-3) a given global day (1-90) falls in. */
export function seasonForGlobalDay(day: number): number {
  return Math.min(3, Math.max(1, Math.ceil(day / SEASON_LENGTH)));
}

export { SEASONS };
