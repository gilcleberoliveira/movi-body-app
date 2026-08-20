const LAST_SEEN_KEY = "movibody:chat-last-seen";
const READ_EVENT = "movibody:chat-read";

export function getChatLastSeen(): string | null {
  try {
    return localStorage.getItem(LAST_SEEN_KEY);
  } catch {
    return null;
  }
}

export function markChatRead(latestTimestamp: string) {
  try {
    const existing = localStorage.getItem(LAST_SEEN_KEY);
    if (!existing || latestTimestamp > existing) {
      localStorage.setItem(LAST_SEEN_KEY, latestTimestamp);
    }
  } catch {
    // localStorage unavailable — badge just won't persist across visits
  }
  window.dispatchEvent(new Event(READ_EVENT));
}

export function onChatRead(handler: () => void) {
  window.addEventListener(READ_EVENT, handler);
  return () => window.removeEventListener(READ_EVENT, handler);
}
