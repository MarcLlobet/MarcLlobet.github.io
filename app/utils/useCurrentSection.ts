"use client";

import { useEffect, useState } from "react";
import { throttle } from "./throttle";
import type { Repository } from "../types";

export const useCurrentSection = (repositories: Repository[]) => {
  const [currentSection, setCurrentSection] = useState<
    Repository["name"] | null
  >(null);

  useEffect(() => {
    const sections = document.getElementsByClassName("page-section");

    const onScroll = throttle(() => {
      const sectionsBoundary = Array.from(sections).map((section) => ({
        top: (section as HTMLElement).offsetTop,
        name: section.id as Repository["name"],
      }));
      const currentPosition = window.scrollY;
      const halfWindowHeight = window.innerHeight / 2;

      const currentSectionInViewport = sectionsBoundary.findLast(
        (section) => currentPosition + halfWindowHeight >= section.top,
      );

      setCurrentSection(currentSectionInViewport?.name ?? null);
    }, 100);

    onScroll(); // onMount
    window.addEventListener("scroll", onScroll);
    window.addEventListener("touchmove", onScroll);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchmove", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [repositories]);

  return currentSection;
};
