"use client";

import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { Mockup } from "../components/Mockup";
import { MOCKUP_KINDS } from "../mockups";
import { accentFor, ACCENTS } from "../utils/projects";

const mono = css`
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const Page = styled.div`
  inline-size: 100%;
  max-inline-size: 90rem;
  margin-inline: auto;
  padding-block: 0 6rem;
`;

const Top = styled.header`
  ${mono}
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem 1.75rem;
  min-block-size: var(--nav-block-size);

  a,
  button {
    display: inline-flex;
    align-items: center;
    min-block-size: var(--tap-target);
    padding: 0;
    font: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    color: var(--color-text);
    background: none;
    border: none;
    cursor: pointer;
  }
`;

const Intro = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-block: clamp(2rem, 8svh, 5rem);
`;

const PageTitle = styled.h1`
  margin: 0;
  font-family: var(--font-sans);
  font-size: clamp(4rem, 12vw, 10rem);
  line-height: 0.88;
  font-weight: 500;
  letter-spacing: -0.05em;
  color: var(--color-heading);
`;

const Lead = styled.p`
  max-inline-size: 52ch;
  font-size: clamp(1.125rem, 1.6vw, 1.375rem);
  line-height: 1.4;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-block-start: 1px solid var(--color-line);
  padding-block: 3rem;
`;

const SectionTitle = styled.h2`
  margin: 0;
  padding-block: 0;
  font-family: var(--font-sans);
  font-size: clamp(2rem, 4vw, 3.25rem);
  line-height: 1;
  font-weight: 500;
  letter-spacing: -0.03em;
`;

const Note = styled.p`
  max-inline-size: 64ch;
  color: var(--color-muted);
`;

const Label = styled.span`
  ${mono}
  color: var(--color-muted);
`;

const Swatches = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  gap: 1rem;
`;

const Swatch = styled.figure`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
`;

const Chip = styled.div<{ $token: string }>`
  block-size: 4.5rem;
  background: var(${({ $token }) => $token});
  border: 1px solid var(--color-line);
`;

const TypeRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 12rem) minmax(0, 1fr);
  align-items: baseline;
  gap: 0.5rem 2rem;
  padding-block: 1.25rem;
  border-block-end: 1px solid var(--color-line);

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Display = styled.span`
  font-size: clamp(3rem, 9vw, 7rem);
  line-height: 0.9;
  font-weight: 500;
  letter-spacing: -0.05em;
  color: var(--color-heading);
`;

const ProjectName = styled.span`
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 0.9;
  font-weight: 500;
  letter-spacing: -0.05em;
  color: var(--color-heading);
`;

const Tagline = styled.span`
  font-size: clamp(1.25rem, 2.3vw, 2.125rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--color-heading);
`;

const MonoSample = styled.span`
  ${mono}
`;

const Links = styled.p`
  ${mono}
  display: flex;
  flex-wrap: wrap;
  gap: 0 1.75rem;

  a {
    display: inline-flex;
    align-items: center;
    min-block-size: var(--tap-target);
    color: var(--color-text);
  }

  a:hover {
    text-decoration-color: var(--accent-1);
  }
`;

const Mockups = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
  gap: 2rem;
`;

const MockupCard = styled.figure`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0;
`;

/* Each sample uses its own shape, to show the mockup reflowing */
const SHAPES = ["16 / 7", "1 / 1", "4 / 5"] as const;

const Frame = styled.div<{ $accent: string; $ratio: string }>`
  --c: ${({ $accent }) => $accent};
  position: relative;
  aspect-ratio: ${({ $ratio }) => $ratio};
  max-block-size: 26rem;
  overflow: hidden;
  background: var(--c);
`;

const Shot = styled.div`
  position: absolute;
  inset-block: 4% 0;
  inset-inline: 4%;
`;

const Rules = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
  gap: 1.5rem 2rem;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-block-start: 1rem;
    border-block-start: 1px solid var(--color-line);
  }

  strong {
    font-weight: 500;
    color: var(--color-heading);
  }
`;

const NEUTRALS = [
  ["--color-bg", "Background"],
  ["--color-surface", "Surface"],
  ["--color-heading", "Heading"],
  ["--color-text", "Text"],
  ["--color-muted", "Muted"],
  ["--color-line", "Line"],
] as const;

const MOTION = [
  [
    "Build with the scroll",
    "Each project reveals from a slit and its mockup builds up in order as it reaches the middle of the screen.",
  ],
  [
    "Play on hover",
    "Hovering a frame plays the project's loop: pulses, waves, flips or a flowing branch.",
  ],
  [
    "One impossible triangle",
    "Three real beams, seen from the only angle where they close. It flies from the hero to the counter, locks on every project in its colour and ends in the footer.",
  ],
  [
    "Still when asked",
    "With reduced motion everything is shown complete and nothing moves.",
  ],
] as const;

export default function DesignPage() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("light-theme", isLight);
  }, [isLight]);

  return (
    <Page>
      <Top>
        <a href="/">← Portfolio</a>
        <button type="button" onClick={() => setIsLight((light) => !light)}>
          {isLight ? "Dark theme" : "Light theme"}
        </button>
      </Top>

      <Intro>
        <Label>Design</Label>
        <PageTitle>Design</PageTitle>
        <Lead>
          The visual language of this portfolio: two typefaces, a quiet neutral
          palette, one accent per project and motion that follows the scroll.
          Component documentation lives in the{" "}
          <a href="/storybook">Storybook</a>.
        </Lead>
      </Intro>

      <Section aria-labelledby="colours">
        <SectionTitle id="colours">Colours</SectionTitle>
        <Note>
          Neutrals carry the page. There is no brand colour: the accent is
          always the project in view. Switch the theme to see both palettes.
        </Note>
        <Swatches>
          {NEUTRALS.map(([token, name]) => (
            <Swatch key={token}>
              <Chip $token={token} />
              <figcaption>
                {name}
                <br />
                <Label>{token}</Label>
              </figcaption>
            </Swatch>
          ))}
        </Swatches>
        <Note>
          Project accents, in pin order. Light mode uses darker shades so they
          stay visible on the light background.
        </Note>
        <Swatches>
          {ACCENTS.map((token) => (
            <Swatch key={token}>
              <Chip $token={token} />
              <figcaption>
                <Label>{token}</Label>
              </figcaption>
            </Swatch>
          ))}
        </Swatches>
      </Section>

      <Section aria-labelledby="type">
        <SectionTitle id="type">Typography</SectionTitle>
        <Note>
          Space Grotesk for everything you read, JetBrains Mono for labels,
          counters and metadata. Use the tokens, never a font name.
        </Note>
        <div>
          <TypeRow>
            <Label>Hero · --font-sans 500</Label>
            <Display>Marc Llobet</Display>
          </TypeRow>
          <TypeRow>
            <Label>Project name · 500</Label>
            <ProjectName>wordle app</ProjectName>
          </TypeRow>
          <TypeRow>
            <Label>Tagline · 400</Label>
            <Tagline>Find the strongest Wordle opener with maths.</Tagline>
          </TypeRow>
          <TypeRow>
            <Label>Body · 400</Label>
            <span>
              Running text stays near 65 characters wide, in the muted colour
              for details and the text colour for everything else.
            </span>
          </TypeRow>
          <TypeRow>
            <Label>Label · --font-mono</Label>
            <MonoSample>03 / 06 · TypeScript · CSS</MonoSample>
          </TypeRow>
        </div>
      </Section>

      <Section aria-labelledby="interaction">
        <SectionTitle id="interaction">Interaction</SectionTitle>
        <Note>
          Links and buttons never change colour on hover: a line appears
          underneath, in the project accent where there is one.
        </Note>
        <Links>
          <a href="#interaction">Live demo ↗</a>
          <a href="#interaction">Code ↗</a>
        </Links>
      </Section>

      <Section aria-labelledby="mockups">
        <SectionTitle id="mockups">Mockups</SectionTitle>
        <Note>
          Each project gets a mockup drawn in SVG, like a small responsive page:
          every measure is a percentage with a minimum and a maximum, and
          columns and rows are recounted for the size of the frame. These
          samples use different shapes on purpose. Hover one to play its loop.
        </Note>
        <Mockups>
          {MOCKUP_KINDS.map((kind, index) => (
            <MockupCard key={kind}>
              <Frame
                data-play="hover"
                $accent={accentFor(index)}
                $ratio={SHAPES[index % SHAPES.length]}
              >
                <Shot>
                  <Mockup kind={kind} />
                </Shot>
              </Frame>
              <figcaption>
                <Label>
                  {kind} · {SHAPES[index % SHAPES.length].replace(" / ", ":")}
                </Label>
              </figcaption>
            </MockupCard>
          ))}
        </Mockups>
      </Section>

      <Section aria-labelledby="motion">
        <SectionTitle id="motion">Motion</SectionTitle>
        <Rules>
          {MOTION.map(([title, text]) => (
            <li key={title}>
              <strong>{title}</strong>
              <Note>{text}</Note>
            </li>
          ))}
        </Rules>
      </Section>
    </Page>
  );
}
