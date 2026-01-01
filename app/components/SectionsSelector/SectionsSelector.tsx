"use client";

import { useCurrentSection } from "../../utils/useCurrentSection";
import { SectionSelector } from "../SectionSelector";
import { SectionsSelectorWrapper } from "./SectionsSelector.styles";
import type { Repository } from "../../types";

export type SectionsSelectorProps = {
  repositories: Repository[];
};

export const SectionsSelector = ({ repositories }: SectionsSelectorProps) => {
  const currentSection = useCurrentSection(repositories);

  return (
    <SectionsSelectorWrapper role="menu">
      {repositories.map((repository) => (
        <SectionSelector
          key={repository.id}
          repository={repository}
          currentSection={currentSection}
        />
      ))}
    </SectionsSelectorWrapper>
  );
};
