import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { throttle } from "../utils/throttle";
import type { Repository } from "../services";
import { SectionWrapper } from "./SectionWrapper";
import { NavWrapper } from "./NavWrapper";
import { SectionSelector } from "./SectionSelector";

const toVisible = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const ScreenWrapper = styled.div`
  opacity: 0;
  animation: ${toVisible} 300ms ease-in forwards 2s;
  inline-size: 100dvw;
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 0;
`

const AsideWrapper = styled.aside`
  inline-size: 10dvw;
  block-size: 100dvh;
  display: flex;
  position: sticky;
  top: 0;
`

const AsideLeftWrapper = styled.div`
  inline-size: 100%;
  block-size: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-inline-start: 15px;
`

const ColumnWrapper = styled.div`
  inline-size: calc(100dvw - (10dvw * 2));
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

const MainWrapper = styled.main`
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin-block-start: 90dvh;
`

const SectionsSelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
`;

const SectionsSelector = ({ currentSection, repositories }: { currentSection: string | null, repositories: Repository[] }) => {

  return (
    <SectionsSelectorWrapper role="menu">
      {
        repositories.map((repository) => (
          <SectionSelector
            key={repository.id} 
            repository={repository}
            currentSection={currentSection}
          />
        ))
      }
    </SectionsSelectorWrapper>
  );
};


export const PageWrapper = ({ repositories }: { repositories: Repository[] }) => {
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
    return () => window.removeEventListener('scroll', onScroll);
  }, [repositories]);

  useEffect(() => {
    const currentHash = window.location.hash.slice(1);

    if(!!currentSection && currentHash !== currentSection) {
      history.replaceState(history.state, "", `#${currentSection}`);
    } else if(!currentSection && currentHash.length){
      const urlWithNoHash = window.location.origin + window.location.pathname;
      history.replaceState(history.state, "", urlWithNoHash);
    }
  }, [currentSection]);

  return (
    <ScreenWrapper>
      <AsideWrapper>
        <AsideLeftWrapper>
          <SectionsSelector 
            currentSection={currentSection} 
            repositories={repositories} 
          />
        </AsideLeftWrapper>
      </AsideWrapper>
      <ColumnWrapper>
        <NavWrapper />
        <MainWrapper>
          {repositories.map(repository => 
            <SectionWrapper 
              key={repository.id}
              repository={repository}
            />
          )}
        </MainWrapper>
      </ColumnWrapper>
      <AsideWrapper/>
    </ScreenWrapper>
  )
}
