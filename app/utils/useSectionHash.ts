"use client";

import { useEffect } from "react";
import { observeSections } from "./observeSections";

/**
 * Keeps the URL's #hash in sync with whichever of `ids` is currently in
 * view, so any point of the page is shareable just by copying the address
 * bar while scrolling — not only via the nav links that already jump to
 * these same ids. Above the first section, the hash is cleared.
 *
 * Uses replaceState (never pushState, never `location.hash =`), so scrolling
 * never pollutes browser history and never triggers a hash-jump of its own.
 */
export const useSectionHash = (ids: string[]) => {
  const key = ids.join(",");

  useEffect(() => {
    const setHash = (id: string | null) => {
      if (window.location.pathname !== "/") return;
      const url = `${window.location.pathname}${window.location.search}${id ? `#${id}` : ""}`;
      window.history.replaceState(null, "", url);
    };
    return observeSections(key.split(",").filter(Boolean), setHash);
  }, [key]);
};
