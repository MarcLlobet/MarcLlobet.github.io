"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { Mockup } from "../components/Mockup";
import { ProjectCase } from "../components/ProjectCase";
import { ScrollScene, SCENE } from "../components/ScrollScene";
import { CursorFollower } from "../components/CursorFollower";
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
import type { Repository } from "../types";
import {
  Board,
  Brand,
  CaseFrame,
  Chip,
  Eyebrow,
  Header,
  Intro,
  Lead,
  LineRow,
  Nav,
  Note,
  Page,
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
};

const pad = (n: number) => String(n).padStart(2, "0");

const isLight = () =>
  document.documentElement.classList.contains("light-theme");

/** The page reads the theme off the document, so the header toggle, the one
 * in the main nav and a reload all agree on what is on. */
const watchTheme = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
};

const useLightTheme = () =>
  useSyncExternalStore(watchTheme, isLight, () => false);

/* What a token resolves to can only be read from the document, and it changes
 * with the theme: the snapshot is cached per theme so it stays stable. */
type Tokens = Record<string, string>;
const NO_TOKENS: Tokens = {};
let cache: { light: boolean; tokens: Tokens } | null = null;

const readTokens = (): Tokens => {
  const light = isLight();
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
  useSyncExternalStore(watchTheme, readTokens, () => NO_TOKENS);

/**
 * The design page is the portfolio explaining itself: the same colours, type
 * and motion the home page runs on, shown with the real components rather
 * than with drawings of them.
 */
export default function DesignPage() {
  const [box, setBox] = useState<BoxId>("frame");
  const light = useLightTheme();
  const values = useTokenValues();
  const ratio = BOXES.find(({ id }) => id === box)!.ratio;

  const toggleTheme = useCallback(() => {
    document.documentElement.classList.toggle("light-theme", !isLight());
  }, []);

  const swatch = (token: string) => (
    <Swatch key={token}>
      <Chip $token={token} />
      <Token>{token}</Token>
      <Value>{values[token] || "—"}</Value>
    </Swatch>
  );

  return (
    <Page>
      <Header>
        <Brand href="/">Marc Llobet</Brand>
        <Nav>
          <button type="button" onClick={toggleTheme}>
            {light ? "Dark" : "Light"}
          </button>
          <a href="/">Back to work ↗</a>
        </Nav>
      </Header>

      <Intro>
        <Eyebrow>
          <span>Design system</span>
          <span>(06) · Built from the live components</span>
        </Eyebrow>
        <PageTitle>Design</PageTitle>
        <Lead>
          One accent per project, two typefaces, a hairline between everything
          and a line that wipes across on hover. Every sample below is the
          component the site itself renders.
        </Lead>
      </Intro>

      <Section id="colour">
        <SectionHead>
          <SectionTitle>Colour</SectionTitle>
          <Note>
            No brand colour: the page is paper and ink, and the accent is
            whichever project is on screen. Switch the theme in the header to
            read the other set of values.
          </Note>
        </SectionHead>
        <Eyebrow>
          <span>Paper and ink</span>
        </Eyebrow>
        <Swatches>{SURFACES.map(swatch)}</Swatches>
        <Eyebrow>
          <span>Project accents · frame, mockup, counter and triangle</span>
        </Eyebrow>
        <Swatches>{ACCENT_TOKENS.map(swatch)}</Swatches>
        <Eyebrow>
          <span>Mockup roles · the tones a drawn page is made of</span>
        </Eyebrow>
        <Swatches>{MOCKUP_TONES.map(swatch)}</Swatches>
      </Section>

      <Section id="type">
        <SectionHead>
          <SectionTitle>Type</SectionTitle>
          <Note>
            Space Grotesk for everything you read, JetBrains Mono for counters,
            languages and links. Sizes are fluid: every step is a clamp of the
            viewport, so a short screen gets smaller headings, not a scrollbar.
          </Note>
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
          <SectionTitle>The line</SectionTitle>
          <Note>
            Nothing changes colour on hover. A 2px line wipes in from the start
            of the word and leaves through its end; where a project owns the
            element, the line takes its accent.
          </Note>
        </SectionHead>
        <LineRow>
          <a href="#line">Code ↗</a>
          <a href="#line" data-accent="1">
            Live demo ↗
          </a>
          <a href="#line" data-accent="2">
            Live demo ↗
          </a>
          <a href="#line" data-accent="3">
            Live demo ↗
          </a>
          <button type="button">Theme</button>
        </LineRow>
        <Note>
          An archive row is the same gesture at the width of the page, with the
          arrow coming out of the name.
        </Note>
        <div>
          {ARCHIVE_SAMPLE.map(({ name, languages }, index) => (
            <Row key={name} href="#line" $accent={accentFor(index + 2)}>
              <RowNumber>{pad(index + 1)}</RowNumber>
              <RowName>
                {name}
                <RowGo aria-hidden="true">↗</RowGo>
              </RowName>
              <RowLanguages>{languages}</RowLanguages>
              <RowTagline>The tagline, up to the first full stop</RowTagline>
            </Row>
          ))}
        </div>
      </Section>

      <Section id="mockups">
        <SectionHead>
          <SectionTitle>Mockups</SectionTitle>
          <Note>
            Each project is drawn, not screenshotted: an SVG page built at the
            exact pixel size of its box. Change the shape of the box and the
            columns, rows and lines are counted again to fill it. Point at one
            to see the loop it plays.
          </Note>
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
          <SectionTitle>One project, one screen</SectionTitle>
          <Note>
            A case is a counter, the name, the frame and the text, and it is at
            least as tall as the viewport: the frame takes whatever the words
            leave. This is the real component, boxed so you can see where it
            ends.
          </Note>
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
          <SectionTitle>The impossible triangle</SectionTitle>
          <Note>
            The mark is a Penrose triangle drawn in WebGL. On the home page it
            flies from the hero to the counter, through every project and into
            the footer, taking the accent of the one it is passing. Here it
            docks in the slot below: the same renderer, the same model.
          </Note>
        </SectionHead>
        <Triangle>
          <TriangleSlot id={SCENE.heroSlot} data-testid="design-shape" />
          <Note>
            Three beams fly in and lock on load and the pointer tilts them. At{" "}
            <code>prefers-reduced-motion</code> the model is still the model:
            built, still, and never swapped for a flat drawing.
          </Note>
        </Triangle>
      </Section>

      {/* The scene draws the triangle over the page, into the slot above */}
      <ScrollScene total={0} />
      <CursorFollower />
    </Page>
  );
}
