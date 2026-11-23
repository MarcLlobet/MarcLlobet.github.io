"use client";

import { useCallback, useSyncExternalStore } from "react";

const canMatch = () =>
  typeof window !== "undefined" && typeof window.matchMedia === "function";

/** Whether a media query matches; false on the server and where matchMedia is missing. */
export const useMediaQuery = (query: string) => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!canMatch()) return () => undefined;
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => canMatch() && window.matchMedia(query).matches,
    () => false,
  );
};

/** A fine pointer that can hover, and no request for reduced motion. */
export const RICH_POINTER =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export const prefersReducedMotion = () =>
  canMatch() && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Whether this browser can animate a View Transition and the visitor allows motion. */
export const canStartViewTransition = () =>
  typeof document !== "undefined" &&
  typeof document.startViewTransition === "function" &&
  !prefersReducedMotion();
