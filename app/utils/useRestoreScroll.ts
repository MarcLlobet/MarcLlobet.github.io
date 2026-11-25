"use client";

import { useLayoutEffect } from "react";
import { consumeReturnScroll } from "./returnNav";

/** Restores the scroll position left by a project page's Back button, the
 * instant the home page mounts — a no-op on any other mount (a fresh
 * visit, or one landing via an ordinary nav link/hash). Applied twice (now,
 * and again next frame): router.back() can land on a URL still carrying an
 * old #section hash from before the project was opened, and re-asserting
 * after whatever that triggers settles is what makes the exact remembered
 * position win over a coarser hash-section jump. */
export const useRestoreScroll = () => {
  useLayoutEffect(() => {
    const pending = consumeReturnScroll();
    if (pending === null) return;
    const scrollToPending = () =>
      window.scrollTo({ top: pending, behavior: "instant" });
    scrollToPending();
    const frame = requestAnimationFrame(scrollToPending);
    return () => cancelAnimationFrame(frame);
  }, []);
};
