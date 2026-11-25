"use client";

import { useEffect } from "react";
import { hasModifier, isDesktop, isTypingTarget } from "./keyTargets";

const STEP_KEYS = new Set(["ArrowDown", "ArrowUp"]);

/**
 * Screen-by-screen navigation for the home page (see screenStepsRuntime),
 * loaded only when it can be used: on a desktop (mouse or trackpad), and
 * only once someone presses a key or turns the wheel. A phone never loads
 * it, and nor does a desktop visit that only clicks.
 *
 * The input that triggers the load isn't lost: an arrow key's own scroll
 * is held back right away, and the module acts on that same key (or wheel
 * gesture) as soon as it arrives.
 */
export const useScreenSteps = (ids: string[], snapCount: number) => {
  const key = ids.join(",");

  useEffect(() => {
    if (!isDesktop()) return;

    let cancelled = false;
    let stop: (() => void) | null = null;
    /*
     * Where the page last came to rest, so the module can measure the wheel
     * gesture that loads it — by the time a wheel event is handled, the
     * browser may already have scrolled for it.
     */
    let restY = window.scrollY;
    const hasScrollEnd = "onscrollend" in window;
    const onScrollEnd = () => {
      restY = window.scrollY;
    };

    const load = (event: KeyboardEvent | WheelEvent) => {
      window.removeEventListener("keydown", load);
      window.removeEventListener("wheel", load);
      window.removeEventListener("scrollend", onScrollEnd);

      if (
        event instanceof KeyboardEvent &&
        STEP_KEYS.has(event.key) &&
        !event.defaultPrevented &&
        !hasModifier(event) &&
        !isTypingTarget(event.target)
      )
        event.preventDefault();

      /* Without scrollend there's nothing better to go on. */
      if (!hasScrollEnd) restY = window.scrollY;
      import("./screenStepsRuntime").then(({ startScreenSteps }) => {
        if (cancelled) return;
        stop = startScreenSteps(key.split(",").filter(Boolean), snapCount, {
          event,
          restY,
        });
      });
    };

    window.addEventListener("keydown", load);
    window.addEventListener("wheel", load, { passive: true });
    window.addEventListener("scrollend", onScrollEnd, { passive: true });
    return () => {
      cancelled = true;
      window.removeEventListener("keydown", load);
      window.removeEventListener("wheel", load);
      window.removeEventListener("scrollend", onScrollEnd);
      stop?.();
    };
  }, [key, snapCount]);
};
