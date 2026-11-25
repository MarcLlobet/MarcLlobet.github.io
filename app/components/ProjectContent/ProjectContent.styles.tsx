"use client";

import styled from "styled-components";
import { mono } from "../../styles";

/*
 * Two columns once there's room for both side by side — the text (title
 * through the data block) on the left, the screenshot filling the right
 * column at its full width. Narrower than that, a single column: the text
 * first, the screenshot after it at the full width of the page instead of
 * a column.
 */
export const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: start;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const TextColumn = styled.div`
  min-inline-size: 0;
`;

export const Title = styled.h1`
  margin-block: clamp(0.5rem, 2svh, 1rem) clamp(1rem, 3svh, 1.5rem);
  font-family: var(--font-sans);
  font-size: clamp(2rem, min(6vw, 9svh), 4.5rem);
  line-height: 0.95;
  font-weight: 500;
  letter-spacing: -0.04em;
  color: var(--color-heading);
`;

/* Fills its column (or the full width, single-column): no separate cap of
 * its own — the grid is what keeps it from reading as the whole page. */
export const Shot = styled.div<{ $accent: string }>`
  --c: ${({ $accent }) => $accent};
  position: relative;
  inline-size: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--c);
`;

/* Scaled up a little past its frame (cropped by Shot's own overflow:hidden):
 * a plain cover fit left too much empty chrome around the actual screenshot. */
export const ShotImage = styled.img`
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
  object-position: top;
  transform: scale(1.1);
`;

export const ShotFallback = styled.div`
  position: absolute;
  inset-block: 5% 0;
  inset-inline: 5%;
  overflow: hidden;
`;

export const Tagline = styled.p`
  max-inline-size: 48ch;
  font-size: clamp(1.25rem, 2vw, 1.625rem);
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--color-heading);
  text-wrap: balance;
`;

export const Detail = styled.p`
  max-inline-size: 60ch;
  margin-block-start: 1rem;
  color: var(--color-muted);
`;

/* Tags, stats and the language breakdown, as one block below the
 * description — a single divider above all of it, not one per piece. */
export const Data = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(1.25rem, 4svh, 2rem);
  margin-block-start: clamp(1.5rem, 5svh, 2.5rem);
  padding-block-start: clamp(1.5rem, 5svh, 2.5rem);
  border-block-start: 1px solid var(--color-line);
`;

export const Tags = styled.div`
  ${mono}
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const Tag = styled.span`
  padding: 0.3rem 0.6rem;
  border: 1px solid var(--color-line-strong);
  color: var(--color-muted);
`;

export const Stats = styled.dl`
  ${mono}
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 0.5rem 2.5rem;
  margin: 0;

  dt {
    color: var(--color-muted);
  }

  dd {
    margin: 0;
    color: var(--color-heading);
  }
`;

export const Languages = styled.div``;

export const LanguageBar = styled.div`
  display: flex;
  block-size: 0.5rem;
  overflow: hidden;
  border-radius: 2px;
`;

export const LanguageSegment = styled.span<{ $color?: string; $grow: number }>`
  flex-grow: ${({ $grow }) => $grow};
  flex-shrink: 0;
  background: ${({ $color }) => $color || "var(--color-muted)"};
`;

export const LanguageLegend = styled.p`
  ${mono}
  display: flex;
  flex-wrap: wrap;
  gap: 0 1.25rem;
  margin-block-start: 0.75rem;
  color: var(--color-muted);
`;

export const Links = styled.p`
  ${mono}
  display: flex;
  flex-wrap: wrap;
  gap: 0 1.75rem;
  margin-block-start: clamp(1.5rem, 5svh, 2.5rem);
  padding-block-end: clamp(2rem, 8svh, 4rem);

  a {
    display: inline-flex;
    align-items: center;
    min-block-size: var(--tap-target);
    color: var(--color-text);
  }
`;
