"use client";

const SCROLL_KEY = "nav:scroll";
const PENDING_RESTORE_KEY = "nav:pending-restore";

/** Called right before leaving the home page for a project: remembers
 * where on the page we were, so a project's Back button can return here
 * instead of just landing at the top. */
export const rememberScroll = () => {
  sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
};

/**
 * Called by a project's Back button right before it navigates away. Moves
 * the remembered scroll position (if any) into a one-shot key the home
 * page consumes on its next mount — never written by any other
 * navigation, so visiting "/" through an ordinary nav link never restores
 * a stale position left over from an earlier project visit. Returns
 * whether a position was actually found (a project opened directly has
 * nothing to return to), mostly so this is easy to verify in a test.
 */
export const prepareReturn = (): boolean => {
  const value = sessionStorage.getItem(SCROLL_KEY);
  if (value === null) return false;
  sessionStorage.removeItem(SCROLL_KEY);
  sessionStorage.setItem(PENDING_RESTORE_KEY, value);
  return true;
};

/** Called once, on the home page's mount: consumes (and clears) a pending
 * scroll restore left by prepareReturn, or null if this mount wasn't the
 * result of a project's Back button. */
export const consumeReturnScroll = (): number | null => {
  const value = sessionStorage.getItem(PENDING_RESTORE_KEY);
  if (value === null) return null;
  sessionStorage.removeItem(PENDING_RESTORE_KEY);
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};
