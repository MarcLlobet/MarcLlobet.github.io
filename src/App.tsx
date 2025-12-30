import { useEffect, useRef, useState } from 'react'
import { fetchPens, fetchRepositories, type Repository } from './services'
import { PageWrapper } from './components/PageWrapper'
import styled, { keyframes } from 'styled-components'
import { MorphShape } from './components/MorphShape';
import { NavWrapper } from './components/NavWrapper';
import { SectionSelector } from './components/SectionSelector';
import { useCurrentSection } from './utils/useCurrentSection';

const toHeavyFontWeightAnimation = keyframes`
  0% { font-weight: 300; }
  100% { font-weight: 900; }
`;

const AnimationWrapper = styled.span`
  animation-name: ${toHeavyFontWeightAnimation};
  animation-duration: 2s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  animation-fill-mode: forwards;
  display: inline-flex;
`;

const FirstNameWrapper = styled(AnimationWrapper)`
  animation-direction: reverse;
`;
const SurnameWrapper = styled(AnimationWrapper)`
  animation-direction: normal;
`;

const NameWrapper = styled.h1`
  display: flex;
  flex-direction: column;
  inline-size: 100%;
  font-size: calc(1rem * var(--golden-ratio) * 4);
  line-height: calc(1rem * var(--golden-ratio) * 3.5);

  @media (max-width: 600px) {
    font-size: calc(1rem * var(--golden-ratio) * 2.5);
    line-height: calc(1rem * var(--golden-ratio) * 2.25);
  }
`;

const HeroWrapper = styled.hgroup`
  display: flex;
  inline-size: 50dvw;
  block-size: calc(100dvh - 60px);
  display: flex;
  align-items: center;
  padding-block-end: 60px;
`;

const CircularAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const CircularShape = styled.div`
  margin-block: calc((100dvh - 60px - 150px) / 2);
  inline-size: calc(50dvw - 30px - 5rem);
  block-size: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted);
  border-radius: 50%;
  position: sticky;
  top: 40dvh;
  z-index: 1;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    position: static;
  }
`;

const CircularShapeWrapper = styled.div`
  animation: ${CircularAnimation} 5s linear infinite;
  transform-origin: 30% 50%;
`;

const AsideWrapper = styled.aside`
  block-size: 100dvh;
  padding-block: var(--spacing);
  display: flex;
  position: sticky;
  top: 0;
  justify-content: center;
  align-items: center;
`

const AsideLeftWrapper = styled.div`
  display: flex;
`

const SectionsSelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--spacing);
  min-inline-size: 20px;

  @media (max-width: 600px) {
    min-inline-size: 30px;
  }
`;

const SectionsSelector = ({repositories }: { repositories: Repository[] }) => {
  const currentSection = useCurrentSection(repositories);

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

function App() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const morphRef = useRef<{ 
    morph: () => void; 
    reset: () => void;
  }>(null);

  useEffect(() => {
    fetchPens().then((pens) => {
      console.log('Fetched pens:', pens);
    });
    fetchRepositories()
    .then((fetchedRepositories) => {
      setRepositories(fetchedRepositories)
    })
  }, [])



  return (
    <div style={{
      display: 'flex', 
      flexDirection: 'row', 
      gap: 'var(--spacing) calc(var(--spacing) * 2)',
      inlineSize: '100%',
    }}>
      <AsideWrapper>
        <AsideLeftWrapper>
          <SectionsSelector
            repositories={repositories} 
          />
        </AsideLeftWrapper>
      </AsideWrapper>
      <div style={{
        display: 'flex', 
        flexDirection: 'row', 
        flexGrow: 1,
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}>
        <NavWrapper repositories={repositories} />
        <HeroWrapper>
          <NameWrapper>
            <FirstNameWrapper>
              Marc
            </FirstNameWrapper>
            <SurnameWrapper>
              Ll<span style={{color: 'var(--color-accent)'}}>o</span>bet
            </SurnameWrapper>
          </NameWrapper>
        </HeroWrapper>
        <CircularShape>
          <CircularShapeWrapper>
            <MorphShape 
              ref={morphRef} 
              size="big" 
              infiniteAnimation
              stroke="var(--color-accent)"
            />
          </CircularShapeWrapper>
        </CircularShape>
        <PageWrapper repositories={repositories}/>
      </div>
    </div>
  )
}

export default App
