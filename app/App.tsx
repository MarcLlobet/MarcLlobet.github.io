"use client";

import { useCallback, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import dynamic from "next/dynamic";
import { NavWrapper } from "./components/NavWrapper";
import { ProjectCase } from "./components/ProjectCase";
import { ArchiveIndex } from "./components/ArchiveIndex";
import { SCENE } from "./components/ScrollScene/scene-ids";
import { SiteFooter } from "./components/SiteFooter";
import { mockupFor, type MockupKind } from "./mockups";
import { accentFor, firstSentence, selectProjects } from "./utils/projects";
import { getAllLanguages } from "./utils/getAllLanguages";
import { canStartViewTransition } from "./utils/useMediaQuery";
import { useSectionHash } from "./utils/useSectionHash";
import { GITHUB_URL } from "./constants";
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

/*
 * None of these three touch the hero or the work section's own content —
 * ScrollScene and CursorFollower are purely decorative (aria-hidden; the
 * cards already render fully revealed via ProjectCase's own --p/--q
 * defaults until ScrollScene's JS takes over), and DemoViewer only exists
 * once a project is actually opened. Loading them as separate, client-only
 * chunks keeps that weight off the critical path for the hero to become
 * interactive.
 */
const ScrollScene = dynamic(
  () =>
    import("./components/ScrollScene").then((mod) => ({
      default: mod.ScrollScene,
    })),
  { ssr: false },
);
const CursorFollower = dynamic(
  () =>
    import("./components/CursorFollower").then((mod) => ({
      default: mod.CursorFollower,
    })),
  { ssr: false },
);
const DemoViewer = dynamic(
  () =>
    import("./components/DemoViewer").then((mod) => ({
      default: mod.DemoViewer,
    })),
  { ssr: false },
);

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
      if (!shot || !canStartViewTransition()) {
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
    if (!shot || !canStartViewTransition()) {
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

  /* Every section the nav already links to is shareable mid-scroll too. */
  useSectionHash(
    archive.length > 0
      ? [SCENE.work, "archive", SCENE.footer]
      : [SCENE.work, SCENE.footer],
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
          githubUrl={GITHUB_URL}
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
