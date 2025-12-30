import { useEffect, useRef, useState } from 'react'
import { fetchPens, fetchRepositories, type Repository } from './services'
import { PageWrapper } from './components/PageWrapper'
import styled, { keyframes } from 'styled-components'
import { MorphShape } from './components/MorphShape';
import { NavWrapper } from './components/NavWrapper';
import { SectionSelector } from './components/SectionSelector';
import { throttle } from './utils/throttle';

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
`;

const HeroWrapper = styled.hgroup`
  display: flex;
  inline-size: 100%;
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
  color: var(--color-muted);
  top: 40dvh;
  right: 15dvw;
  border-radius: 50%;
  overflow: hidden;
  z-index: 1;
  animation: ${CircularAnimation} 5s linear infinite;
  transform-origin: 35% 45%;
  position: fixed;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    position: absolute;
  }

  @media (prefers-color-scheme: light) {
    z-index: 0;
  }
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
        flexDirection: 'column', 
        flexGrow: 1
      }}>
        <NavWrapper repositories={repositories} />
        <div style={{
          display: 'flex', 
          flexDirection: 'row',
          blockSize: 'calc(100dvh - var(--spacing) * 3)',
          paddingBlockEnd: 'calc(var(--spacing) * 3)',
          justifyContent: 'center',
          alignItems: 'center', 
        }}>
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
            <MorphShape 
              ref={morphRef} 
              size="big" 
              infiniteAnimation
              stroke="var(--color-accent)"
            />
          </CircularShape>
        </div>
        <PageWrapper repositories={repositories}/>
      </div>
    </div>
  )
}

export default App
