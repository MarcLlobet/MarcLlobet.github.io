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
  MainWrapper,
  NameWrapper,
  SurnameWrapper,
  WindowWrapper,
} from "./App.styles";

export const App = () => {
  return (
    <WindowWrapper data-testid="app-root">
      <AsideWrapper>
        <AsideLeftWrapper>
          <SectionsSelector />
        </AsideLeftWrapper>
      </AsideWrapper>
      <MainWrapper>
        <NavWrapper />
        <HeroWrapper>
          <NameWrapper>
            <FirstNameWrapper>Marc</FirstNameWrapper>
            <SurnameWrapper>
              Ll<span style={{ color: "var(--color-accent)" }}>o</span>bet
            </SurnameWrapper>
          </NameWrapper>
        </HeroWrapper>
        <CircularShape>
          <CircularShapeWrapper>
            <MorphShape
              size="big"
              infiniteAnimation
              stroke="var(--color-accent)"
            />
          </CircularShapeWrapper>
        </CircularShape>
        <PageWrapper />
      </MainWrapper>
    </WindowWrapper>
  );
};
