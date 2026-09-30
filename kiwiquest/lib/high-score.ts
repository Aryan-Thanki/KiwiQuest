const storageKey = "kiwiquest:high-score";
const listeners = new Set<() => void>();

// The high score lives in localStorage, so it is per browser. Reads and writes
// are wrapped because storage can throw (private mode, blocked site data).
export function getHighScore() {
  try {
    const value = Number(window.localStorage.getItem(storageKey));
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

export function getServerHighScore() {
  return 0;
}

export function saveHighScore(score: number) {
  try {
    window.localStorage.setItem(storageKey, String(score));
  } catch {
    // Storage unavailable: the score still shows for this game, it just won't persist.
  }
  listeners.forEach((listener) => listener());
}

export function subscribeToHighScore(listener: () => void) {
  const onStorage = (event: StorageEvent) => { if (event.key === storageKey) listener(); };
  listeners.add(listener);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
