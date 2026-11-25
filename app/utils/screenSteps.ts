/*
 * Pure helpers behind useScreenSteps: where each "screen" of the home page
 * starts, and which one an arrow key or a wheel gesture should land on.
 * No React here, so the maths can be tested without rendering anything.
 */

/** Two positions this close count as the same place (sub-pixel rounding, zoom). */
export const SAME_SPOT_PX = 8;

/**
 * An element's top edge in document coordinates, ignoring CSS transforms.
 *
 * getBoundingClientRect() can't be used: useOverlapStack pins whole sections
 * with transform: translateY while the next one covers them, so a pinned
 * section's rect follows the scroll position. offsetTop is pure layout —
 * transforms never touch it — so it always gives the natural position the
 * page is built around.
 */
export const documentTop = (element: HTMLElement): number => {
  let top = 0;
  let node: HTMLElement | null = element;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
};

/**
 * The scroll position that puts each element's top just under the sticky
 * header, clamped to what the page can actually scroll to.
 */
export const stopPositions = (
  elements: HTMLElement[],
  headerHeight: number,
  maxScroll: number,
): number[] =>
  elements.map((element) =>
    Math.min(maxScroll, Math.max(0, documentTop(element) - headerHeight)),
  );

/**
 * A screen can run past the viewport without being worth an extra stop of
 * its own: a project is 100svh tall under a sticky header, and the hero is
 * followed by the Projects title before the first one.
 */
const SCREEN_SLACK = 1.5;

/**
 * Where one arrow press should go from `y`: the next (or previous) stop —
 * unless it's well over a screen away, in which case one screen, so a
 * section taller than the viewport is read through instead of jumped over.
 */
export const stepTarget = (
  stops: number[],
  y: number,
  direction: 1 | -1,
  screen: number,
): number => {
  if (direction === 1) {
    const next = stops.find((stop) => stop > y + SAME_SPOT_PX);
    if (next === undefined) return y;
    return next - y <= screen * SCREEN_SLACK ? next : y + screen;
  }
  const previous = [...stops].reverse().find((stop) => stop < y - SAME_SPOT_PX);
  if (previous === undefined) return y;
  return y - previous <= screen * SCREEN_SLACK ? previous : y - screen;
};

/** The index of the stop sitting at `y`, or -1 when `y` is between stops. */
export const stopAt = (stops: number[], y: number): number =>
  stops.findIndex((stop) => Math.abs(stop - y) <= SAME_SPOT_PX);

/** The index of the stop closest to `y`. */
export const nearestStop = (stops: number[], y: number): number =>
  stops.reduce(
    (best, stop, index) =>
      Math.abs(stop - y) < Math.abs(stops[best] - y) ? index : best,
    0,
  );

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
