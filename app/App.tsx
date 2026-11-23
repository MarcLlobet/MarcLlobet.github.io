"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { ProjectCase } from "./components/ProjectCase";
import { ArchiveIndex } from "./components/ArchiveIndex";
import { SCENE } from "./components/ScrollScene/scene-ids";
import { SiteFooter } from "./components/SiteFooter";
import { mockupFor, type MockupKind } from "./mockups";
import { accentFor, firstSentence, selectProjects } from "./utils/projects";
import { getAllLanguages } from "./utils/getAllLanguages";
import { useSectionHash } from "./utils/useSectionHash";
import { GITHUB_URL } from "./constants";
import {
  EmptyWork,
  Facts,
  HeroBottom,
  HeroSection,
  HeroTop,
  Letter,
  Name,
  NameGroup,
  NameLine,
  Pitch,
  SectionHead,
  ShapeSlot,
  Work,
} from "./App.styles";
import type { Repository } from "./types";

/*
 * Purely decorative (aria-hidden): the cards already render fully revealed
 * via ProjectCase's own --p/--q defaults until ScrollScene's JS takes over.
 * Loading it as a separate, client-only chunk keeps that weight off the
 * critical path for the hero to become interactive.
 */
const ScrollScene = dynamic(
  () =>
    import("./components/ScrollScene").then((mod) => ({
      default: mod.ScrollScene,
    })),
  { ssr: false },
);

const NO_PINS: string[] = [];

type Item = { repository: Repository; accent: string; kind: MockupKind };

const lettersOf = (word: string, offset: number = 0) =>
  [...word].map((letter, i) => (
    <Letter key={i} $i={offset + i}>
      {letter}
    </Letter>
  ));

const pad = (n: number) => String(n).padStart(2, "0");

/* A dot never starts a line: it is glued to the word before it */
const list = (items: string[]) => items.join(" · ");

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
  const { featured, archive } = useMemo(() => {
    const { featured, archive } = selectProjects(repositories, pinned);
    const toItem = (repository: Repository, index: number): Item => ({
      repository,
      accent: accentFor(index),
      kind: mockupFor(repository),
    });
    return { featured: featured.map(toItem), archive };
  }, [repositories, pinned]);

  const total = featured.length;
  const languages = useMemo(
    () => getAllLanguages(repositories),
    [repositories],
  );

  /* Every section the nav already links to is shareable mid-scroll too. */
  useSectionHash(
    archive.length > 0
      ? [SCENE.work, SCENE.archive, SCENE.footer]
      : [SCENE.work, SCENE.footer],
  );

  return (
    <div data-testid="app-root" id="top">
      <a className="skip-to-content" href="#work">
        Skip to projects
      </a>
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
    </div>
  );
};
