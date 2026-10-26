/**
 * Lets anything on the page claim the speakers — a highlights film, say —
 * without reaching into <BackgroundMusic />.
 *
 * Claims are counted rather than flagged: with two films open, stopping the
 * first would otherwise hand the music back while the second is still playing.
 * `suspendBackgroundAudio` returns its own release function so a caller can't
 * release a claim it didn't make, or release the same one twice.
 *
 * The count lives at module scope rather than in the event alone because
 * BackgroundMusic retries playback on tab focus and on the visitor's first
 * interaction; those paths need to ask "am I allowed right now?" at the moment
 * they fire, not remember the last event they happened to hear.
 */
const EVENT = "wedding:background-audio-suspended";

let claims = 0;

export const isBackgroundAudioSuspended = () => claims > 0;

function announce(suspended: boolean) {
  window.dispatchEvent(new CustomEvent<boolean>(EVENT, { detail: suspended }));
}

/** Silences the site music until the returned function is called. */
export function suspendBackgroundAudio(): () => void {
  claims += 1;
  if (claims === 1) announce(true);

  let released = false;
  return () => {
    if (released) return;
    released = true;
    claims -= 1;
    if (claims === 0) announce(false);
  };
}

/** Subscribe to changes; returns the unsubscribe function. */
export function onBackgroundAudioSuspendedChange(fn: (suspended: boolean) => void) {
  const handler = (e: Event) => fn((e as CustomEvent<boolean>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
