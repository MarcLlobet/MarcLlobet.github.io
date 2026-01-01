"use client";

import { PageWrapper } from "./components/PageWrapper";
import { MorphShape } from "./components/MorphShape";
import { NavWrapper } from "./components/NavWrapper";
import { SectionsSelector } from "./components/SectionsSelector";
import {
  AsideLeftWrapper,
  AsideWrapper,
  CircularShape,
  CircularShapeWrapper,
  FirstNameWrapper,
  HeroWrapper,
  HighlightLetter,
  MainWrapper,
  NameWrapper,
  SurnameWrapper,
  WindowWrapper,
} from "./App.styles";
import type { Repository, Bio } from "./types";

const HeroSection = () => (
  <>
    <HeroWrapper>
      <NameWrapper>
        <FirstNameWrapper>Marc</FirstNameWrapper>
        <SurnameWrapper>
          Ll<HighlightLetter>o</HighlightLetter>bet
        </SurnameWrapper>
      </NameWrapper>
    </HeroWrapper>
    <CircularShape>
      <CircularShapeWrapper>
        <MorphShape size="big" infiniteAnimation stroke="var(--color-accent)" />
      </CircularShapeWrapper>
    </CircularShape>
  </>
);

type AppProps = {
  repositories: Repository[];
  bio: Bio;
};

export const App = ({ repositories, bio }: AppProps) => {
  return (
    <WindowWrapper data-testid="app-root">
      <AsideWrapper>
        <AsideLeftWrapper>
          <SectionsSelector repositories={repositories} />
        </AsideLeftWrapper>
      </AsideWrapper>
      <MainWrapper>
        <NavWrapper bio={bio} repositories={repositories} />
        <HeroSection />
        <PageWrapper repositories={repositories} />
      </MainWrapper>
    </WindowWrapper>
  );
};
