import { useEffect, useState } from "react";
import type { Repository } from "../services";
import { throttle } from "./throttle";

export const useCurrentSection = (repositories: Repository[]) => {
  const [currentSection, setCurrentSection] = useState<Repository['name'] | null>(null);

  useEffect(() => {
    const sections = document.getElementsByClassName('page-section');
    const sectionsBoundary = Array.from(sections).map((section) => {
      const rect = section?.getBoundingClientRect();
      return {
        top: rect.top,
        name: section.id as Repository['name'],
      };
    });

    const onScroll = throttle(() => {
      const currentPosition = window.scrollY;
      const halfWindowHeight = window.innerHeight / 2;

      const currentSectionInViewport = sectionsBoundary.findLast((section) => currentPosition + halfWindowHeight >= section.top);
      
      setCurrentSection(currentSectionInViewport?.name ?? null);
    }, 500);

    window.addEventListener('scroll', onScroll);
    window.addEventListener('touchmove', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('touchmove', onScroll);
    };
  }, [repositories]);

  return currentSection;
}
