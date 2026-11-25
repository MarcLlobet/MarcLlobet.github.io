"use client";

import { prefersReducedMotion } from "./useMediaQuery";

/*
 * How long PageReveal's clip-path transition takes. The circle's radius
 * covers the content a click opens up well before this finishes (the
 * origin is always close to what it's revealing), so most of the actual
 * motion plays out in roughly the first third of this — longer than the
 * 600ms it used to be specifically so that third is still enough real
 * time to read as a grow, not a pop.
 */
export const REVEAL_MS = 900;

const originOf = (element: HTMLElement | null) => {
  if (!element) return { x: window.innerWidth, y: 0 };
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};

/**
 * Sets --vt-x/--vt-y (in px, on the root element) to the centre of `anchor`.
 * A clip-path transition reading those variables can then appear to grow
 * from, or collapse into, that element.
 */
export const setTransitionOrigin = (anchor: HTMLElement | null) => {
  const { x, y } = originOf(anchor);
  const html = document.documentElement;
  html.style.setProperty("--vt-x", `${x}px`);
  html.style.setProperty("--vt-y", `${y}px`);
};

/** PageReveal listens for this to collapse the current page's reveal back
 * toward --vt-x/--vt-y instead of only ever growing from it. */
export const PAGE_EXIT_EVENT = "page-exit";

/**
 * Plays the reveal in reverse on whatever page is currently showing — the
 * same circle it grew in from, collapsing back into it — and resolves once
 * that's done, so a "back" action can await it before actually navigating
 * away. --vt-x/--vt-y are left untouched: whatever page grew in is exactly
 * where this collapses back into, and whatever mounts next (re-localising
 * those same coordinates for its own box) grows back out of the same spot.
 */
export const requestPageExit = (): Promise<void> =>
  new Promise((resolve) => {
    window.dispatchEvent(new Event(PAGE_EXIT_EVENT));
    if (prefersReducedMotion()) resolve();
    else setTimeout(resolve, REVEAL_MS);
  });
