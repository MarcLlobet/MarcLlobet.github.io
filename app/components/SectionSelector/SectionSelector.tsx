"use client";

import { useEffect, useMemo, useRef } from "react";
import { MorphShape } from "../MorphShape";
import { StyledSectionSelector } from "./SectionSelector.styles";

export type SectionSelectorProps = {
  repository: { id: string; name: string };
  currentSection: string | null;
};

export const SectionSelector = ({
  repository,
  currentSection,
}: SectionSelectorProps) => {
  const morphRef = useRef<{
    morph: () => void;
    reset: () => void;
  }>(null);

  const isSelected = useMemo(
    () => repository.name === currentSection,
    [repository.name, currentSection],
  );

  useEffect(() => {
    if (isSelected) {
      morphRef.current?.morph();
    } else {
      morphRef.current?.reset();
    }
  }, [isSelected]);

  useEffect(() => {
    const currentHash = window.location.hash.slice(1);

    if (!!currentSection && currentHash !== currentSection) {
      history.replaceState(history.state, "", `#${currentSection}`);
    } else if (!currentSection && currentHash.length) {
      const urlWithNoHash = window.location.origin + window.location.pathname;
      history.replaceState(history.state, "", urlWithNoHash);
    }
  }, [currentSection]);

  return (
    <StyledSectionSelector
      // A plain anchor: the browser scrolls (smoothly, via CSS) with no JS
      href={`#${repository.name}`}
      role="menuitemradio"
      aria-checked={isSelected}
      aria-label={`Go to ${repository.name} section`}
      $isSelected={isSelected}
    >
      <MorphShape ref={morphRef} size="small" title={repository.name} />
    </StyledSectionSelector>
  );
};
