"use client";

/** How long PageReveal's clip-path transition takes. */
export const REVEAL_MS = 600;

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
