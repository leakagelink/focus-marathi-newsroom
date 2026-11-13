// Shared "one voice at a time" signal: when narration starts, every playing video pauses.
type PauseListener = () => void;

const listeners = new Set<PauseListener>();

export function onMediaPauseRequest(listener: PauseListener) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function requestMediaPause() {
  for (const listener of [...listeners]) listener();
}
