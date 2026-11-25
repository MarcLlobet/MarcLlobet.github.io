"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { ProjectCase } from "./components/ProjectCase";
import { ArchiveIndex } from "./components/ArchiveIndex";
import { Meta } from "./components/Meta";
import {
  SCENE_SLOT_HERO,
  SCENE_SLOT_END,
  HERO,
  PROJECTS,
  ARCHIVE,
  META,
  SITE_FOOTER,
} from "./components/ScrollScene/scene-ids";
import { SiteFooter } from "./components/SiteFooter";
import { Key } from "./components/KeyHint";
import { mockupFor, type MockupKind } from "./mockups";
import { accentFor, selectProjects, splitDescription } from "./utils/projects";
import { getAllLanguages } from "./utils/getAllLanguages";
import { useSectionHash } from "./utils/useSectionHash";
import { useOverlapStack } from "./utils/useOverlapStack";
import { useScreenSteps } from "./utils/useScreenSteps";
import { GITHUB_URL } from "./constants";
import {
  EmptyProjects,
  Facts,
  HeroBottom,
  HeroMiddle,
  HeroSection,
  KeysDetail,
  KeysTerm,
  Letter,
  Name,
  NameGroup,
  NameLine,
  PitchDetail,
  Projects,
  ProjectsHeader,
  ShapeSlot,
  Tagline,
  Title,
} from "./App.styles";
import type { Repository, SiteRepository } from "./types";
import { copy } from "./content/copy";
import { useCopy } from "./utils/copy";

const [ROLE_WORD_1, ROLE_WORD_2] = copy["hero.role"].split(" ");

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
  /** The GitHub bio, in full. */
  bio: string;
  featured: number;
  archived: number;
  languages: string[];
};

const Hero = ({ bio, featured, archived, languages }: HeroProps) => {
  const { t } = useCopy();
  const { tagline, detail } = splitDescription(bio);
  return (
    <HeroSection id={HERO}>
      <HeroMiddle>
        <NameGroup>
          <Name>
            <NameLine>{lettersOf(ROLE_WORD_1, 0)}</NameLine>
            <NameLine>{lettersOf(ROLE_WORD_2, ROLE_WORD_1.length)}</NameLine>
          </Name>
        </NameGroup>
        <ShapeSlot id={SCENE_SLOT_HERO} data-testid="hero-shape" />
      </HeroMiddle>
      <Tagline>{tagline}</Tagline>
      <HeroBottom>
        {detail && <PitchDetail>{detail}</PitchDetail>}
        <Facts>
          <dt>{t("home.factsProjectsLabel")}</dt>
          <dd>
            {list([
              `(${pad(featured)}) ${t("home.factsFeaturedSuffix")}`,
              `(${pad(archived)}) ${t("home.factsArchivedSuffix")}`,
            ])}
          </dd>
          <dt>{t("home.factsBuiltWith")}</dt>
          <dd>{list(languages.slice(0, 5))}</dd>
          <KeysTerm>{t("home.factsKeysLabel")}</KeysTerm>
          <KeysDetail>
            <Key glyph="↑" label={t("keys.arrowUp")} />
            <Key glyph="↓" label={t("keys.arrowDown")} />
            {t("home.factsKeysBrowse")} ·
            <Key glyph="↵" label={t("keys.enter")} />
            {t("home.factsKeysOpen")}
          </KeysDetail>
        </Facts>
      </HeroBottom>
    </HeroSection>
  );
};

type AppProps = {
  repositories: Repository[];
  bio: string;
  /** Pinned repositories become the featured projects. */
  pinned?: string[];
  /** This repo's own description and languages, for the Meta section. */
  site: SiteRepository | null;
};

export const App = ({
  repositories,
  bio,
  pinned = NO_PINS,
  site,
}: AppProps) => {
  const { t } = useCopy();
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
      ? [HERO, PROJECTS, ARCHIVE, META, SITE_FOOTER]
      : [HERO, PROJECTS, META, SITE_FOOTER],
  );

  /* Each of these covers the tail end of the one before it while scrolling. */
  useOverlapStack(
    archive.length > 0
      ? [HERO, PROJECTS, ARCHIVE, META, SITE_FOOTER]
      : [HERO, PROJECTS, META, SITE_FOOTER],
  );

  /*
   * One screen at a time from the keyboard (↑/↓, Enter opens a project),
   * and the hero plus every project snap with a mouse or trackpad.
   */
  const projectIds = featured.map(({ repository }) => repository.name);
  useScreenSteps(
    archive.length > 0
      ? [HERO, ...projectIds, ARCHIVE, META, SITE_FOOTER]
      : [HERO, ...projectIds, META, SITE_FOOTER],
    1 + projectIds.length,
  );

  return (
    <div data-testid="app-root">
      <a className="skip-to-content" href="#projects">
        {t("home.skipToContent")}
      </a>
      <Hero
        bio={bio}
        featured={total}
        archived={archive.length}
        languages={languages}
      />
      <Projects id={PROJECTS} aria-labelledby="projects-title">
        <ProjectsHeader>
          <span>{t("home.eyebrow")}</span>
          <span>
            ({pad(total)}) {t("home.pinnedSuffix")}
          </span>
        </ProjectsHeader>
        <Title id="projects-title">{t("home.title")}</Title>
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
          <EmptyProjects>{t("home.emptyProjects")}</EmptyProjects>
        )}
      </Projects>
      {archive.length > 0 && <ArchiveIndex repositories={archive} />}
      <Meta id={META} repository={site} />
      <SiteFooter
        id={SITE_FOOTER}
        slotId={SCENE_SLOT_END}
        githubUrl={GITHUB_URL}
      />
      <ScrollScene total={total} />
    </div>
  );
};
