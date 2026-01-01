"use client";

import { useMemo } from "react";
import { SectionWrapper } from "../SectionWrapper";
import { useCurrentSection } from "../../utils/useCurrentSection";
import {
  ScreenWrapper,
  ColumnWrapper,
  MainWrapper,
  Footer,
  ScrollToTopButton,
} from "./PageWrapper.styles";
import type { Repository } from "../../types";

export type PageWrapperProps = {
  repositories: Repository[];
};

export const PageWrapper = ({ repositories }: PageWrapperProps) => {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isLastSectionsByName = useMemo(
    () =>
      repositories.reduce(
        (prev, repository, repositoryIndex) => ({
          ...prev,
          [repository.name]: repositoryIndex >= repositories.length / 2,
        }),
        {} as Record<Repository["name"], boolean>,
      ),
    [repositories],
  );

  const currentSection = useCurrentSection(repositories);

  const isLastSections =
    isLastSectionsByName[currentSection as string] ?? false;

  return (
    <ScreenWrapper>
      <ColumnWrapper>
        <MainWrapper id="main-content">
          {repositories.map((repository) => (
            <SectionWrapper key={repository.id} repository={repository} />
          ))}
          <Footer>
            <ScrollToTopButton
              type="button"
              onClick={handleScrollTop}
              $shouldShow={isLastSections}
              aria-label="Scroll to top"
            >
              <svg
                stroke="currentColor"
                strokeWidth={4}
                fill="none"
                viewBox="0 0 100 100"
              >
                <desc>Scroll to top</desc>
                <path d="M50 2L2 98h98L50 2z" />
              </svg>
            </ScrollToTopButton>
          </Footer>
        </MainWrapper>
      </ColumnWrapper>
    </ScreenWrapper>
  );
};
