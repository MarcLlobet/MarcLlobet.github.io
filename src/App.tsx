import { useEffect, useRef, useState } from 'react'
import { fetchRepositories, type Repository } from './services'
import { PageWrapper } from './components/PageWrapper'
import styled, { keyframes } from 'styled-components'
import { MorphShape } from './components/MorphShape';

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
  position: relative;
  z-index: 1;
`;

const HeroWrapper = styled.hgroup`
  display: flex;
  flex-direction: column;
  block-size: 80dvh;
  inline-size: 80dvw;
  padding-block-start: 5dvh;
  padding-block-end: 5dvh;
  justify-content: center;
  z-index: 10;
  position: absolute;
  left: 10dvw;
  right: 10dvw;
  top: 10dvh;
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
  position: absolute;
  top: 40dvh;
  right: 15dvw;
  border-radius: 50%;
  overflow: hidden;
  z-index: 0;
  animation: ${CircularAnimation} 5s linear infinite;
  transform-origin: 35% 45%;
`;

function App() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const morphRef = useRef<{ 
    morph: () => void; 
    reset: () => void;
  }>(null);

  useEffect(() => {
    fetchRepositories()
    .then((fetchedRepositories) => {
      setRepositories(fetchedRepositories)
    })
  }, [])



  return (
    <>
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
      <PageWrapper repositories={repositories}/>
    </>
  )
}

export default App
