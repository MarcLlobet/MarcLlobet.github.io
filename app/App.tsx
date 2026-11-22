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
import { accentFor, firstSentence, selectProjects } from "./utils/projects";
import { getAllLanguages } from "./utils/getAllLanguages";
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
import type { Repository } from "./types";

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

const pad = (n: number) => String(n).padStart(2, "0");

/* A dot never starts a line: it is glued to the word before it */
const list = (items: string[]) => items.join("\u00a0· ");

type HeroProps = {
  /** The GitHub bio: its opening sentence is the pitch. */
  bio: string;
  featured: number;
  archived: number;
  languages: string[];
};

const Hero = ({ bio, featured, archived, languages }: HeroProps) => (
  <HeroSection>
    <HeroTop>
      <NameGroup>
        <Name>
          <NameLine>{lettersOf("Marc", 0)}</NameLine>
          <NameLine>{lettersOf("Llobet", 4)}</NameLine>
        </Name>
      </NameGroup>
      <ShapeSlot id={SCENE.heroSlot} data-testid="hero-shape" />
    </HeroTop>
    <HeroBottom>
      <Pitch>{firstSentence(bio)}</Pitch>
      <Facts>
        <dt>Work</dt>
        <dd>
          {list([`(${pad(featured)}) featured`, `(${pad(archived)}) archived`])}
        </dd>
        <dt>Built with</dt>
        <dd>{list(languages.slice(0, 5))}</dd>
      </Facts>
    </HeroBottom>
  </HeroSection>
);

const canTransition = () =>
  typeof document.startViewTransition === "function" && !prefersReducedMotion();

type AppProps = {
  repositories: Repository[];
  bio: string;
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
    return { featured: featured.map(toItem), archive };
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
  const languages = useMemo(
    () => getAllLanguages(repositories),
    [repositories],
  );

  return (
    <Page data-testid="app-root" id="top">
      <a className="skip-to-content" href="#main-content">
        Skip to projects
      </a>
      <Header>
        <Brand href="#top">Frontend Engineer</Brand>
        <NavWrapper
          bio={bio}
          repositories={repositories}
          hasArchive={archive.length > 0}
        />
      </Header>
      <Hero
        bio={bio}
        featured={total}
        archived={archive.length}
        languages={languages}
      />
      <Work id={SCENE.work} aria-label="Selected work">
        <SectionHead>
          <span>Selected work</span>
          <span>({pad(total)}) · Pinned on GitHub</span>
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
      {archive.length > 0 && <ArchiveIndex repositories={archive} />}
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
