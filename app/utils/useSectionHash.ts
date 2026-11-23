"use client";

import { useEffect } from "react";

/** A thin band near the vertical centre: a section "counts" once it crosses it. */
const ROOT_MARGIN = "-45% 0px -55% 0px";

/**
 * Keeps the URL's #hash in sync with whichever of `ids` is currently in
 * view, so any point of the page is shareable just by copying the address
 * bar while scrolling — not only via the nav links that already jump to
 * these same ids. Above the first section, the hash is cleared.
 *
 * Uses replaceState (never pushState, never `location.hash =`), so scrolling
 * never pollutes browser history and never triggers a hash-jump of its own.
 * No-ops where IntersectionObserver isn't available.
 */
export const useSectionHash = (ids: string[]) => {
  const key = ids.join(",");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const elements = key
      .split(",")
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const order = elements.map((el) => el.id);
    const visible = new Set<string>();

    const setHash = (id: string | null) => {
      if (window.location.pathname !== "/") return;
      const url = `${window.location.pathname}${window.location.search}${id ? `#${id}` : ""}`;
      window.history.replaceState(null, "", url);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const current = order.filter((id) => visible.has(id)).pop() ?? null;
        setHash(current);
      },
      { rootMargin: ROOT_MARGIN },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);
};
