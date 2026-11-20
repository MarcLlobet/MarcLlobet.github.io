"use client";

import { useCallback, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { NavWrapper } from "./components/NavWrapper";
import { ProjectCase } from "./components/ProjectCase";
import { ArchiveIndex } from "./components/ArchiveIndex";
import { ScrollScene, SCENE } from "./components/ScrollScene";
import { DemoViewer } from "./components/DemoViewer";
import { CursorFollower } from "./components/CursorFollower";
import { SiteFooter } from "./components/SiteFooter";
import { mockupFor, type MockupKind } from "./mockups";
import { accentFor, selectProjects } from "./utils/projects";
import { prefersReducedMotion } from "./utils/useMediaQuery";
import {
  Brand,
  EmptyWork,
  Facts,
  Header,
  HeroBottom,
  HeroSection,
  HeroTop,
  Letter,
  Name,
  NameGroup,
  NameLine,
  Page,
  Pitch,
  SectionHead,
  ShapeSlot,
  Work,
} from "./App.styles";
import type { Repository, Bio } from "./types";

const GITHUB_URL = "https://github.com/MarcLlobet";
const NO_PINS: string[] = [];

type Item = { repository: Repository; accent: string; kind: MockupKind };
type OpenDemo = Item & { frame: HTMLAnchorElement };

const lettersOf = (word: string, offset: number) =>
  [...word].map((letter, i) => (
    <Letter key={i} $i={offset + i}>
      {letter}
    </Letter>
  ));

const Hero = () => (
  <HeroSection>
    <HeroTop>
      <NameGroup>
        <Name>
          <NameLine>{lettersOf("Marc", 0)}</NameLine>
          <NameLine>{lettersOf("Llobet", 4)}</NameLine>
        </Name>
      </NameGroup>
      <ShapeSlot id={SCENE.heroSlot} data-testid="hero-shape">
        <svg
          viewBox="0 0 180 160"
          aria-hidden="true"
          data-scene-fallback="true"
          fill="none"
          stroke="currentColor"
        >
          <polygon points="90,6 174,152 6,152" strokeWidth="2" />
          <polygon points="90,52 134,128 46,128" strokeWidth="2" />
        </svg>
      </ShapeSlot>
    </HeroTop>
    <HeroBottom>
      <Pitch>
        Frontend engineer building design systems, server-rendered apps and
        things made of SVG.
      </Pitch>
      <Facts>
        <dt>Now</dt>
        <dd>Boundless</dd>
        <dt>Before</dt>
        <dd>Typeform, Worldsensing</dd>
      </Facts>
    </HeroBottom>
  </HeroSection>
);

const canTransition = () =>
  typeof document.startViewTransition === "function" && !prefersReducedMotion();

type AppProps = {
  repositories: Repository[];
  bio: Bio;
  /** Pinned repositories become the featured projects. */
  pinned?: string[];
};

export const App = ({ repositories, bio, pinned = NO_PINS }: AppProps) => {
  const [demo, setDemo] = useState<OpenDemo | null>(null);

  const { featured, archive } = useMemo(() => {
    const { featured, archive } = selectProjects(repositories, pinned);
    const toItem = (repository: Repository, index: number): Item => ({
      repository,
      accent: accentFor(index),
      kind: mockupFor(repository),
    });
    return {
      featured: featured.map(toItem),
      archive: archive.map((repository, index) =>
        toItem(repository, index + featured.length),
      ),
    };
  }, [repositories, pinned]);

  /* The preview grows into the full-screen demo inside a View Transition */
  const openDemo = useCallback(
    (repository: Repository, frame: HTMLAnchorElement) => {
      const item = featured.find((it) => it.repository.id === repository.id);
      if (!item) return;
      const shot = frame.querySelector<HTMLElement>("[data-shot]");
      const show = () => flushSync(() => setDemo({ ...item, frame }));
      if (!shot || !canTransition()) {
        show();
        return;
      }
      shot.style.viewTransitionName = "demo-shot";
      document.startViewTransition(() => {
        shot.style.viewTransitionName = "";
        show();
      });
    },
    [featured],
  );

  const closeDemo = useCallback(() => {
    if (!demo) return;
    const { frame } = demo;
    const shot = frame.querySelector<HTMLElement>("[data-shot]");
    const hide = () => flushSync(() => setDemo(null));
    if (!shot || !canTransition()) {
      hide();
      frame.focus();
      return;
    }
    const transition = document.startViewTransition(() => {
      hide();
      shot.style.viewTransitionName = "demo-shot";
    });
    transition.finished.finally(() => {
      shot.style.viewTransitionName = "";
      frame.focus();
    });
  }, [demo]);

  const total = featured.length;

  return (
    <Page data-testid="app-root" id="top">
      <a className="skip-to-content" href="#main-content">
        Skip to projects
      </a>
      <Header>
        <Brand href="#top">Marc Llobet</Brand>
        <NavWrapper bio={bio} repositories={repositories} />
      </Header>
      <Hero />
      <Work id={SCENE.work} aria-label="Selected work">
        <SectionHead>
          <span>Selected work</span>
          <span>({String(total).padStart(2, "0")}) · Pinned on GitHub</span>
        </SectionHead>
        {featured.map(({ repository, accent, kind }, index) => (
          <ProjectCase
            key={repository.id}
            repository={repository}
            index={index}
            total={total}
            accent={accent}
            kind={kind}
            onOpen={openDemo}
          />
        ))}
        {total === 0 && (
          <EmptyWork>
            No pinned projects yet. Pin repositories tagged “demo” on the GitHub
            profile to feature them here.
          </EmptyWork>
        )}
      </Work>
      {archive.length > 0 && <ArchiveIndex items={archive} />}
      <SiteFooter
        id={SCENE.footer}
        slotId={SCENE.endSlot}
        githubUrl={GITHUB_URL}
      />
      <ScrollScene total={total} />
      <CursorFollower />
      {demo && (
        <DemoViewer
          repository={demo.repository}
          accent={demo.accent}
          kind={demo.kind}
          onClose={closeDemo}
        />
      )}
    </Page>
  );
};
