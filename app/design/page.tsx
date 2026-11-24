"use client";

import { useState, useSyncExternalStore } from "react";
import { Mockup } from "../components/Mockup";
import { ProjectCase } from "../components/ProjectCase";
import { ScrollScene, SCENE_SLOT_HERO } from "../components/ScrollScene";
import { isLightTheme, subscribeToTheme } from "../utils/theme";
import {
  Row,
  RowGo,
  RowLanguages,
  RowName,
  RowNumber,
  RowTagline,
} from "../components/ArchiveIndex/ArchiveIndex.styles";
import { MOCKUP_KINDS } from "../mockups";
import { accentFor } from "../utils/projects";
import { useCopy } from "../utils/copy";
import type { Repository } from "../types";
import {
  Board,
  CaseFrame,
  Chip,
  Eyebrow,
  Intro,
  Lead,
  LineRow,
  Note,
  PageTitle,
  Sample,
  Section,
  SectionHead,
  SectionTitle,
  Specimen,
  SpecimenMeta,
  Specimens,
  Swatch,
  Swatches,
  Switch,
  Tile,
  TileFrame,
  TileName,
  TileShot,
  Token,
  Triangle,
  TriangleSlot,
  Value,
} from "./design.styles";

/* Every colour the page is built from, in the order the system uses them. */
const SURFACES = [
  "--color-bg",
  "--color-surface",
  "--color-line",
  "--color-line-strong",
  "--color-muted",
  "--color-text",
  "--color-heading",
] as const;

const ACCENT_TOKENS = [
  "--accent-1",
  "--accent-2",
  "--accent-3",
  "--accent-4",
  "--accent-5",
  "--accent-6",
] as const;

const MOCKUP_TONES = [
  "--mk-surf",
  "--mk-head",
  "--mk-ink",
  "--mk-bar",
  "--mk-bar2",
  "--mk-grey",
] as const;

const ALL_TOKENS = [...SURFACES, ...ACCENT_TOKENS, ...MOCKUP_TONES];

const TYPE = [
  {
    kind: "display",
    name: "Name",
    role: "The hero, once per page",
    size: "clamp(4.5rem, min(15vw, 22svh), 14.5rem)",
    text: "Marc Llobet",
  },
  {
    kind: "project",
    name: "Project",
    role: "The title of a case",
    size: "clamp(2rem, min(12vw, 14svh), 11.5rem)",
    text: "mobile store",
  },
  {
    kind: "row",
    name: "Archive row",
    role: "A line of the index",
    size: "clamp(1.625rem, 3.4vw, 3rem)",
    text: "vanilla documents",
  },
  {
    kind: "tagline",
    name: "Tagline",
    role: "What a project is, in one line",
    size: "clamp(1.25rem, min(2.3vw, 4svh), 2.125rem)",
    text: "Satellite heat data on a map anyone can open",
  },
  {
    kind: "body",
    name: "Body",
    role: "The detail under a tagline",
    size: "clamp(1rem, 0.85rem + 0.7vmin, 1.25rem)",
    text: "A thermal Earth-observation frontend built with Next.js and React Query, with map layers that load lazily so the interface stays instant.",
  },
  {
    kind: "label",
    name: "Label",
    role: "Counters, languages, links",
    size: "0.8125rem · JetBrains Mono",
    text: "01 / 06 · TypeScript",
  },
] as const;

/* The shapes a mockup gets asked to fill on the real page. */
const BOXES = [
  { id: "frame", label: "Desktop frame", ratio: "16 / 9" },
  { id: "tablet", label: "Tablet", ratio: "4 / 3" },
  { id: "phone", label: "Phone", ratio: "9 / 16" },
  { id: "band", label: "Short band", ratio: "21 / 6" },
] as const;

type BoxId = (typeof BOXES)[number]["id"];

const ARCHIVE_SAMPLE = [
  { name: "vanilla documents", languages: "TypeScript · HTML · Go" },
  { name: "pet manager", languages: "HTML · TypeScript · CSS" },
] as const;

const SAMPLE_CASE: Repository = {
  id: "sample",
  name: "mobile-store",
  isArchived: false,
  owner: { login: "MarcLlobet" },
  defaultBranchRef: { name: "main" },
  homepageUrl: "https://marcllobet.github.io/mobile-store",
  url: "https://github.com/MarcLlobet/mobile-store",
  description:
    "A phone store built to feel effortless — search answers instantly, the cart survives a reload, and pages glide into each other.",
  primaryLanguage: { name: "TypeScript" },
  languages: [{ name: "TypeScript" }, { name: "CSS" }, { name: "HTML" }],
  topics: ["demo"],
  preview: "",
  stars: 8,
  createdAt: "2024-02-01T00:00:00Z",
  pushedAt: "2026-04-01T00:00:00Z",
};

const pad = (n: number) => String(n).padStart(2, "0");

/* What a token resolves to can only be read from the document, and it changes
 * with the theme: the snapshot is cached per theme so it stays stable. */
type Tokens = Record<string, string>;
const NO_TOKENS: Tokens = {};
let cache: { light: boolean; tokens: Tokens } | null = null;

const readTokens = (): Tokens => {
  const light = isLightTheme();
  if (!cache || cache.light !== light) {
    const style = getComputedStyle(document.documentElement);
    cache = {
      light,
      tokens: Object.fromEntries(
        ALL_TOKENS.map((token) => [
          token,
          style.getPropertyValue(token).trim(),
        ]),
      ),
    };
  }
  return cache.tokens;
};

const useTokenValues = () =>
  useSyncExternalStore(subscribeToTheme, readTokens, () => NO_TOKENS);

/**
 * The design page is the portfolio explaining itself: the same colours, type
 * and motion the home page runs on, shown with the real components rather
 * than with drawings of them.
 */
export default function DesignPage() {
  const { t } = useCopy();
  const [box, setBox] = useState<BoxId>("frame");
  const values = useTokenValues();
  const ratio = BOXES.find(({ id }) => id === box)!.ratio;

  const swatch = (token: string) => (
    <Swatch key={token}>
      <Chip $token={token} />
      <Token>{token}</Token>
      <Value>{values[token] || "—"}</Value>
    </Swatch>
  );

  return (
    <>
      <Intro>
        <Eyebrow>
          <span>{t("design.intro.eyebrowLeft")}</span>
          <span>{t("design.intro.eyebrowRight")}</span>
        </Eyebrow>
        <PageTitle>{t("design.intro.title")}</PageTitle>
        <Lead>{t("design.intro.lead")}</Lead>
      </Intro>

      <Section id="colour">
        <SectionHead>
          <SectionTitle>{t("design.colour.title")}</SectionTitle>
          <Note>{t("design.colour.note")}</Note>
        </SectionHead>
        <Eyebrow>
          <span>{t("design.colour.paperAndInk")}</span>
        </Eyebrow>
        <Swatches>{SURFACES.map(swatch)}</Swatches>
        <Eyebrow>
          <span>{t("design.colour.projectAccents")}</span>
        </Eyebrow>
        <Swatches>{ACCENT_TOKENS.map(swatch)}</Swatches>
        <Eyebrow>
          <span>{t("design.colour.mockupRoles")}</span>
        </Eyebrow>
        <Swatches>{MOCKUP_TONES.map(swatch)}</Swatches>
      </Section>

      <Section id="type">
        <SectionHead>
          <SectionTitle>{t("design.type.title")}</SectionTitle>
          <Note>{t("design.type.note")}</Note>
        </SectionHead>
        <Specimens>
          {TYPE.map(({ kind, name, role, size, text }) => (
            <Specimen key={kind}>
              <Sample $kind={kind}>{text}</Sample>
              <SpecimenMeta>
                <b>{name}</b>
                <span>{role}</span>
                <code>{size}</code>
              </SpecimenMeta>
            </Specimen>
          ))}
        </Specimens>
      </Section>

      <Section id="line">
        <SectionHead>
          <SectionTitle>{t("design.line.title")}</SectionTitle>
          <Note>{t("design.line.note")}</Note>
        </SectionHead>
        <LineRow>
          <a href="#line">{t("design.line.codeLabel")}</a>
          <a href="#line" data-accent="1">
            {t("design.line.liveDemoLabel")}
          </a>
          <a href="#line" data-accent="2">
            {t("design.line.liveDemoLabel")}
          </a>
          <a href="#line" data-accent="3">
            {t("design.line.liveDemoLabel")}
          </a>
          <button type="button">{t("design.line.themeLabel")}</button>
        </LineRow>
        <Note>{t("design.line.archiveRowNote")}</Note>
        <div>
          {ARCHIVE_SAMPLE.map(({ name, languages }, index) => (
            <Row key={name} href="#line" $accent={accentFor(index + 2)}>
              <RowNumber>{pad(index + 1)}</RowNumber>
              <RowName>
                {name}
                <RowGo aria-hidden="true">↗</RowGo>
              </RowName>
              <RowLanguages>{languages}</RowLanguages>
              <RowTagline>{t("design.line.archiveRowTagline")}</RowTagline>
            </Row>
          ))}
        </div>
      </Section>

      <Section id="mockups">
        <SectionHead>
          <SectionTitle>{t("design.mockups.title")}</SectionTitle>
          <Note>{t("design.mockups.note")}</Note>
        </SectionHead>
        <Switch>
          {BOXES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={box === id}
              onClick={() => setBox(id)}
            >
              {label}
            </button>
          ))}
        </Switch>
        <Board $narrow={box === "phone"}>
          {MOCKUP_KINDS.map((kind, index) => (
            <Tile key={kind}>
              <TileFrame
                $accent={accentFor(index)}
                $ratio={ratio}
                data-play="hover"
              >
                <TileShot>
                  <Mockup kind={kind} />
                </TileShot>
              </TileFrame>
              <TileName>
                <span>{kind}</span>
                <span>{pad(index + 1)}</span>
              </TileName>
            </Tile>
          ))}
        </Board>
      </Section>

      <Section id="case">
        <SectionHead>
          <SectionTitle>{t("design.case.title")}</SectionTitle>
          <Note>{t("design.case.note")}</Note>
        </SectionHead>
        <CaseFrame>
          <ProjectCase
            repository={SAMPLE_CASE}
            index={1}
            total={6}
            accent={accentFor(1)}
            kind="store"
          />
        </CaseFrame>
      </Section>

      <Section id="triangle">
        <SectionHead>
          <SectionTitle>{t("design.triangle.title")}</SectionTitle>
          <Note>{t("design.triangle.note")}</Note>
        </SectionHead>
        <Triangle>
          <TriangleSlot id={SCENE_SLOT_HERO} data-testid="design-shape" />
          <Note>
            {t("design.triangle.noteContinuedPrefix")}
            <code>prefers-reduced-motion</code>
            {t("design.triangle.noteContinuedSuffix")}
          </Note>
        </Triangle>
      </Section>

      {/* The scene draws the triangle over the page, into the slot above */}
      <ScrollScene total={0} />
    </>
  );
}
