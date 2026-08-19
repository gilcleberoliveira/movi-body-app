export type MissionState = "avoiding" | "bad-day" | "intimidated" | "reset" | "reflect";

export const MISSION_STATES: { id: MissionState; label: string }[] = [
  { id: "avoiding", label: "I'm avoiding" },
  { id: "bad-day", label: "I had a bad day" },
  { id: "intimidated", label: "I feel intimidated" },
  { id: "reset", label: "I need a reset" },
  { id: "reflect", label: "I want to reflect" },
];

export type Mission = {
  id: number;
  state: MissionState;
  title: string;
  prompt: string;
};

export const MISSIONS: Mission[] = [
  {
    id: 1,
    state: "avoiding",
    title: "The 30-Second Start",
    prompt: "Don't plan the whole session. Just put your shoes on and take one step outside. That's the entire mission.",
  },
  {
    id: 2,
    state: "avoiding",
    title: "Name the Excuse",
    prompt: "Write down the exact excuse running through your head right now. Seeing it in writing usually breaks its grip.",
  },
  {
    id: 3,
    state: "bad-day",
    title: "Half Counts",
    prompt: "Do half of what you'd normally do — literally half the time or half the reps. It still counts.",
  },
  {
    id: 4,
    state: "bad-day",
    title: "Move Without a Goal",
    prompt: "Skip the plan entirely today. Just move your body for ten minutes with no target at all.",
  },
  {
    id: 5,
    state: "intimidated",
    title: "Go When It's Empty",
    prompt: "Pick the quietest possible time or place to move today — no audience required.",
  },
  {
    id: 6,
    state: "intimidated",
    title: "Watch One Video",
    prompt: "Watch a two-minute video of someone doing the exact movement that intimidates you. Familiarity lowers the fear.",
  },
  {
    id: 7,
    state: "reset",
    title: "Clean Slate Walk",
    prompt: "Take a 10-minute walk with your phone left behind. No goal but resetting your head.",
  },
  {
    id: 8,
    state: "reset",
    title: "Water and Sleep Check",
    prompt: "Before anything else today, drink a full glass of water and note what time you'll actually go to bed tonight.",
  },
  {
    id: 9,
    state: "reflect",
    title: "One Honest Sentence",
    prompt: "Write one sentence about how this week actually went — not how you wish it went.",
  },
  {
    id: 10,
    state: "reflect",
    title: "Three Things That Held",
    prompt: "Name three things that stayed consistent this month, even in the hard weeks.",
  },
];

export function missionById(id: number): Mission | undefined {
  return MISSIONS.find((m) => m.id === id);
}

export function missionsByState(state: MissionState): Mission[] {
  return MISSIONS.filter((m) => m.state === state);
}
