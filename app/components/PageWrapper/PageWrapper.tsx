"use client";

import { SectionWrapper } from "../SectionWrapper";
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
  return (
    <ScreenWrapper>
      <ColumnWrapper>
        <MainWrapper id="main-content">
          {repositories.map((repository) => (
            <SectionWrapper key={repository.id} repository={repository} />
          ))}
          <Footer>
            <ScrollToTopButton href="#top" aria-label="Scroll to top">
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
