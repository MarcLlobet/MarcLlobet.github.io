import styled, { keyframes } from "styled-components";
import type { Repository } from "../services";
import { SectionWrapper } from "./SectionWrapper";
import { useMemo } from "react";
import { useCurrentSection } from "../utils/useCurrentSection";

const toVisible = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const ScreenWrapper = styled.div`
  opacity: 0;
  animation: ${toVisible} 300ms ease-in forwards 2s;
  display: flex;
  flex-direction: row;
  top: 0;
`

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const MainWrapper = styled.main`
  display: flex;
  flex-direction: column;
`

const Footer = styled.footer`
  padding-block-end: var(--spacing);
  padding-block-start: calc(var(--spacing) / 4);
  position: sticky;
  bottom: 0;
  display: flex;
  gap: var(--spacing);
  align-items: center;
  justify-content: flex-end;
  z-index: 1;
  inline-size: 100%;
`;

const ScrollToTopButton = styled.button<{ $shouldShow: boolean }>`
  background: none;
  border: none;
  font-size: var(--spacing);
  line-height: var(--spacing);
  font-weight: 500;
  transition: opacity 300ms ease-in;
  cursor: pointer;
  pointer-events: ${(props) => (props.$shouldShow ? 'auto' : 'none')};
  opacity: ${(props) => (props.$shouldShow ? 1 : 0)};
  color: var(--color-muted);
  &:hover {
    color: var(--color-accent);
  }
  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;


export const PageWrapper = ({ repositories }: { repositories: Repository[] }) => {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLastSectionsByName = useMemo(() =>
    repositories.reduce((prev, repository, repositoryIndex) => ({
      ...prev,
      [repository.name]: repositoryIndex >= repositories.length / 2
    }), {} as Record<Repository['name'], boolean>)
  , [repositories]);

  const currentSection = useCurrentSection(repositories);

  const isLastSections = isLastSectionsByName[currentSection as string] ?? false;

  return (
    <ScreenWrapper>
      <ColumnWrapper>
        <MainWrapper>
          {repositories.map((repository) => (
            <SectionWrapper 
              key={repository.id}
              repository={repository}
            />
          ))}
          <Footer>
            <ScrollToTopButton 
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
                <path d="M50 2L2 98h98L50 2z"/>
              </svg>
            </ScrollToTopButton>
          </Footer>
        </MainWrapper>
      </ColumnWrapper>
    </ScreenWrapper>
  )
}
