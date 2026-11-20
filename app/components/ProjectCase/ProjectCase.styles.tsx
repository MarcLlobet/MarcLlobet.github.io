"use client";

import styled, { css } from "styled-components";

const TWO_COLUMNS =
  "(min-width: 900px), (min-width: 600px) and (orientation: landscape)";
const WIDE = "(min-width: 1100px)";

const mono = css`
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

type Side = { $even: boolean };

/*
 * One project = one screen. --p (reveal) and --q (mockup build) go from 0 to 1
 * as the project scrolls in; the scene sets them. --case-reserve is the room the
 * name, text and paddings need: the frame takes the rest of the screen, with no
 * fixed aspect ratio, and the mockup inside reflows to whatever shape it gets.
 */
export const Case = styled.section<Side & { $accent: string }>`
  --c: ${({ $accent }) => $accent};
  --p: 1;
  --dir: ${({ $even }) => ($even ? -1 : 1)};
  --case-reserve: 27rem;
  display: flex;
  flex-direction: column;
  border-block-start: 1px solid var(--color-line);
  padding-block: clamp(1rem, 5svh, 2.5rem) clamp(1.5rem, 8svh, 4.5rem);

  @media ${TWO_COLUMNS} {
    --case-reserve: 21rem;
  }
`;

export const Meta = styled.div`
  ${mono}
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  color: var(--color-muted);
`;

export const Index = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
`;

export const Dot = styled.span`
  display: inline-block;
  inline-size: 0.625rem;
  block-size: 0.625rem;
  background: var(--c);
`;

export const Languages = styled.span`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;
`;

export const Name = styled.h2<Side>`
  margin-block: clamp(0.5rem, 2svh, 1rem) clamp(0.75rem, 3.5svh, 2rem);
  padding-block: 0;
  font-family: var(--font-sans);
  font-size: clamp(2rem, min(12vw, 14svh), 11.5rem);
  line-height: 0.88;
  font-weight: 500;
  letter-spacing: -0.05em;
  color: var(--color-heading);
  overflow-wrap: anywhere;
  text-wrap: balance;
  text-align: start;
  transform: translateX(calc((1 - var(--p)) * 7% * var(--dir)));
  opacity: calc(0.25 + var(--p) * 0.75);

  @media ${TWO_COLUMNS} {
    text-align: ${({ $even }) => ($even ? "end" : "start")};
  }
`;

export const Body = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(1rem, 3svh, 2.5rem) 2rem;
  align-items: end;

  @media ${TWO_COLUMNS} {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }
`;

export const Frame = styled.a<Side>`
  &:hover {
    text-decoration: none;
  }

  position: relative;
  display: block;
  inline-size: 100%;
  block-size: clamp(8rem, calc(100svh - var(--case-reserve)), 40rem);
  overflow: hidden;
  background: var(--c);
  clip-path: inset(
    calc((1 - var(--p)) * 46%) calc((1 - var(--p)) * 3%) round 2px
  );

  @media ${TWO_COLUMNS} {
    grid-row: 1;
    grid-column: ${({ $even }) => ($even ? "6 / span 7" : "1 / span 7")};
    justify-self: ${({ $even }) => ($even ? "end" : "start")};
  }

  @media ${WIDE} {
    grid-column: ${({ $even }) => ($even ? "5 / span 8" : "1 / span 8")};
  }
`;

export const Shot = styled.div`
  position: absolute;
  inset-block: 4% 0;
  inset-inline: 4%;
  overflow: hidden;
  transform: scale(calc(1.16 - var(--p) * 0.16));
  transform-origin: 50% 0;
`;

export const Text = styled.div<Side>`
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 2.5svh, 1.375rem);
  min-inline-size: 0;

  @media ${TWO_COLUMNS} {
    grid-row: 1;
    grid-column: ${({ $even }) => ($even ? "1 / span 5" : "8 / span 5")};
  }

  @media ${WIDE} {
    grid-column: ${({ $even }) => ($even ? "1 / span 4" : "9 / span 4")};
  }
`;

export const Tagline = styled.p`
  font-size: clamp(1.25rem, min(2.3vw, 4svh), 2.125rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--color-heading);
  text-wrap: balance;
`;

export const Detail = styled.p`
  max-inline-size: 46ch;
  color: var(--color-muted);

  @media (max-height: 640px) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }

  @media (max-height: 480px) {
    -webkit-line-clamp: 2;
  }
`;

export const Links = styled.p`
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
    text-decoration-color: var(--c);
  }
`;
