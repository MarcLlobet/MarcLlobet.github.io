"use client";

import styled, { css } from "styled-components";
import { mono } from "../styles";

export const Page = styled.div`
  inline-size: 100%;
  min-inline-size: 0;
  max-inline-size: 90rem;
  margin-inline: auto;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-s);
`;

export const Brand = styled.a`
  ${mono}
  display: inline-flex;
  align-items: center;
  min-block-size: var(--tap-target);
  color: var(--color-text);
`;

export const Nav = styled.nav`
  ${mono}
  display: flex;
  align-items: center;
  gap: 1.75rem;

  a,
  button {
    display: inline-flex;
    align-items: center;
    min-block-size: var(--tap-target);
    padding: 0;
    font: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    color: var(--color-muted);
    background: none;
    border: none;
    cursor: pointer;
  }
`;

export const Intro = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 5svh, 2.5rem);
  padding-block: clamp(2rem, 9svh, 6rem) clamp(2.5rem, 9svh, 5rem);
`;

export const Eyebrow = styled.p`
  ${mono}
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  color: var(--color-muted);
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-family: var(--font-sans);
  font-size: clamp(3.5rem, min(13vw, 20svh), 12rem);
  line-height: 0.86;
  font-weight: 500;
  letter-spacing: -0.055em;
  color: var(--color-heading);
`;

export const Lead = styled.p`
  max-inline-size: 42ch;
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  line-height: 1.3;
  color: var(--color-heading);
  text-wrap: balance;
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: clamp(1.25rem, 4svh, 2.25rem);
  border-block-start: 1px solid var(--color-line);
  padding-block: clamp(2rem, 7svh, 4rem);
`;

export const SectionHead = styled.div`
  display: grid;
  gap: 0.75rem 2rem;

  @media (min-width: 760px) {
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    align-items: end;
  }
`;

export const SectionTitle = styled.h2`
  padding-block: 0;
  font-family: var(--font-sans);
  font-size: clamp(1.75rem, 4.5vw, 3.25rem);
  line-height: 1;
  font-weight: 500;
  letter-spacing: -0.03em;
  color: var(--color-heading);
`;

export const Note = styled.p`
  max-inline-size: 52ch;
  color: var(--color-muted);
`;

/* Colour */

/* The 1px gaps read as one hairline grid; an empty track stays empty */
export const Swatches = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8.5rem, 1fr));
  gap: 1px;
`;

export const Swatch = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.875rem;
  background: var(--color-bg);
  box-shadow: 0 0 0 1px var(--color-line);
`;

export const Chip = styled.span<{ $token: string }>`
  block-size: 3.5rem;
  background: var(${({ $token }) => $token});
  box-shadow: inset 0 0 0 1px var(--color-line);
`;

export const Token = styled.span`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-heading);
  overflow-wrap: anywhere;
`;

export const Value = styled.span`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-muted);
  text-transform: uppercase;
`;

/* Type */

export const Specimens = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Specimen = styled.div`
  display: grid;
  gap: 0.5rem 2rem;
  border-block-start: 1px solid var(--color-line);
  padding-block: clamp(1rem, 3svh, 1.75rem);

  @media (min-width: 760px) {
    grid-template-columns: minmax(0, 8fr) minmax(0, 4fr);
    align-items: baseline;
  }
`;

export const SpecimenMeta = styled.div`
  ${mono}
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  color: var(--color-muted);

  b {
    color: var(--color-text);
    font-weight: inherit;
  }

  code {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    text-transform: none;
    letter-spacing: 0;
    overflow-wrap: anywhere;
  }
`;

export const Sample = styled.p<{ $kind: string }>`
  color: var(--color-heading);
  overflow-wrap: anywhere;

  ${({ $kind }) =>
    $kind === "display" &&
    css`
      font-size: clamp(3rem, min(10vw, 16svh), 7rem);
      line-height: 0.86;
      font-weight: 500;
      letter-spacing: -0.055em;
    `}
  ${({ $kind }) =>
    $kind === "project" &&
    css`
      font-size: clamp(2rem, min(8vw, 12svh), 5rem);
      line-height: 0.88;
      font-weight: 500;
      letter-spacing: -0.05em;
    `}
  ${({ $kind }) =>
    $kind === "row" &&
    css`
      font-size: clamp(1.625rem, 3.4vw, 3rem);
      line-height: 1.05;
      font-weight: 500;
      letter-spacing: -0.03em;
    `}
  ${({ $kind }) =>
    $kind === "tagline" &&
    css`
      font-size: clamp(1.25rem, min(2.3vw, 4svh), 2.125rem);
      line-height: 1.15;
      letter-spacing: -0.02em;
    `}
  ${({ $kind }) =>
    $kind === "body" &&
    css`
      max-inline-size: 46ch;
      color: var(--color-muted);
    `}
  ${({ $kind }) =>
    $kind === "label" &&
    css`
      ${mono}
      color: var(--color-text);
    `}
`;

/* The line */

export const LineRow = styled.div`
  ${mono}
  display: flex;
  flex-wrap: wrap;
  gap: 0 2.5rem;
  border-block-start: 1px solid var(--color-line);
  padding-block: clamp(1rem, 3svh, 1.75rem);

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

  a[data-accent="1"] {
    --line: var(--accent-1);
  }
  a[data-accent="2"] {
    --line: var(--accent-2);
  }
  a[data-accent="3"] {
    --line: var(--accent-3);
  }
`;

/* Mockups */

export const Switch = styled.div`
  ${mono}
  display: flex;
  flex-wrap: wrap;
  gap: 0 1.75rem;

  button {
    display: inline-flex;
    align-items: center;
    min-block-size: var(--tap-target);
    padding: 0;
    font: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    color: var(--color-muted);
    background: none;
    border: none;
    cursor: pointer;
  }

  button[aria-pressed="true"] {
    color: var(--color-heading);
  }

  button[aria-pressed="true"]::after {
    transform: scaleX(1);
    transform-origin: 0 50%;
  }
`;

export const Board = styled.div<{ $narrow: boolean }>`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(${({ $narrow }) => ($narrow ? "9rem" : "17rem")}, 1fr)
  );
  gap: clamp(1rem, 3vw, 2rem);
`;

export const Tile = styled.figure`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin: 0;
  min-inline-size: 0;
`;

export const TileFrame = styled.div<{ $accent: string; $ratio: string }>`
  --c: ${({ $accent }) => $accent};
  position: relative;
  aspect-ratio: ${({ $ratio }) => $ratio};
  inline-size: 100%;
  overflow: hidden;
  background: var(--c);
`;

export const TileShot = styled.div`
  position: absolute;
  inset-block: 5% 0;
  inset-inline: 5%;
  overflow: hidden;
`;

export const TileName = styled.figcaption`
  ${mono}
  display: flex;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  color: var(--color-muted);
`;

/* One project, one screen */

export const CaseFrame = styled.div`
  border: 1px solid var(--color-line);

  /* The real section, boxed: its own rule would double the one above */
  & > section {
    border-block-start: none;
    padding-inline: clamp(1rem, 3vw, 2rem);
  }
`;

/* The triangle */

export const Triangle = styled.div`
  display: grid;
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: center;

  @media (min-width: 760px) {
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  }
`;

/* The room the triangle lands in: the scene draws it over this box */
export const TriangleSlot = styled.div`
  inline-size: clamp(11rem, 26vw, 22rem);
  aspect-ratio: 1.1 / 1;
  justify-self: center;
`;
