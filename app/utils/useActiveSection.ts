"use client";

import { useEffect, useState } from "react";
import { observeSections } from "./observeSections";

/**
 * Which of `ids` is currently in view, reactively — for highlighting the
 * nav link that matches wherever the page has scrolled to. Shares its
 * notion of "current" with useSectionHash, which drives the address bar
 * from the same observation.
 */
export const useActiveSection = (ids: string[]): string | null => {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    return observeSections(key.split(",").filter(Boolean), setActive);
  }, [key]);

  return active;
};
