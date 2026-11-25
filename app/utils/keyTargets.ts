/*
 * What a key press lands on. Kept apart from screenSteps so the code that
 * ships with every page (useBackKey, the lazy loader in useScreenSteps)
 * pulls in only these few lines.
 */

/** A device with a real mouse or trackpad: the one the keyboard features are for. */
export const DESKTOP_QUERY = "(hover: hover) and (pointer: fine)";

/** True on a desktop; false wherever matchMedia isn't there to ask (tests, old engines). */
export const isDesktop = (): boolean =>
  typeof window.matchMedia === "function" &&
  window.matchMedia(DESKTOP_QUERY).matches;

const EDITABLE =
  "input, textarea, select, [contenteditable]:not([contenteditable='false'])";

/** True while the user is typing somewhere: keys belong to that field, not to the page. */
export const isTypingTarget = (target: EventTarget | null): boolean =>
  target instanceof Element && target.closest(EDITABLE) !== null;

/** True on a key that already does something on its own (a link, a button…). */
export const isInteractiveTarget = (target: EventTarget | null): boolean =>
  target instanceof Element &&
  target.closest("a[href], button, summary, [role='button'], [role='link']") !==
    null;

export const hasModifier = (event: KeyboardEvent): boolean =>
  event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
