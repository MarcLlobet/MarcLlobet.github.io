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
    const sectionsBoundary = Array.from(sections).map((section) => {
      return {
        top: (section as HTMLElement).offsetTop,
        name: section.id as Repository["name"],
      };
    });

    const onScroll = throttle(() => {
      const currentPosition = window.scrollY;
      const halfWindowHeight = window.innerHeight / 2;

      const currentSectionInViewport = sectionsBoundary.findLast(
        (section) => currentPosition + halfWindowHeight >= section.top,
      );

      setCurrentSection(currentSectionInViewport?.name ?? null);
    }, 500);

    onScroll(); // onMount
    window.addEventListener("scroll", onScroll);
    window.addEventListener("touchmove", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchmove", onScroll);
    };
  }, [repositories]);

  return currentSection;
};
