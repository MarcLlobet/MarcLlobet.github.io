"use client";

import styled from "styled-components";
import { mono } from "../../styles";

/* The language on the start side, the ⌫ back hint (desktop only) on the end side. */
export const Meta = styled.p`
  ${mono}
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem 1.5rem;
  color: var(--color-muted);
`;

export const Title = styled.h1`
  margin-block: clamp(0.5rem, 2svh, 1rem) clamp(1.5rem, 5svh, 3rem);
  font-family: var(--font-sans);
  font-size: clamp(2.5rem, min(12vw, 16svh), 9rem);
  line-height: 0.88;
  font-weight: 500;
  letter-spacing: -0.05em;
  color: var(--color-heading);
`;

export const Shot = styled.div<{ $accent: string }>`
  --c: ${({ $accent }) => $accent};
  position: relative;
  inline-size: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--c);
  margin-block-end: clamp(1.5rem, 5svh, 3rem);
`;

export const ShotImage = styled.img`
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
  object-position: top;
`;

export const ShotFallback = styled.div`
  position: absolute;
  inset-block: 5% 0;
  inset-inline: 5%;
  overflow: hidden;
`;

export const Tagline = styled.p`
  max-inline-size: 48ch;
  font-size: clamp(1.375rem, 2.3vw, 2rem);
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

export const Tags = styled.div`
  ${mono}
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-block-start: clamp(1.5rem, 5svh, 2.5rem);
`;

export const Tag = styled.span`
  padding: 0.3rem 0.6rem;
  border: 1px solid var(--color-line-strong);
  color: var(--color-muted);
`;

export const Stats = styled.dl`
  ${mono}
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 0.5rem 2.5rem;
  margin: 0;
  margin-block-start: clamp(1.5rem, 5svh, 2.5rem);
  padding-block-start: clamp(1.5rem, 5svh, 2.5rem);
  border-block-start: 1px solid var(--color-line);

  dt {
    color: var(--color-muted);
  }

  dd {
    margin: 0;
    color: var(--color-heading);
  }
`;

export const Languages = styled.div`
  margin-block-start: clamp(1.5rem, 5svh, 2.5rem);
`;

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
