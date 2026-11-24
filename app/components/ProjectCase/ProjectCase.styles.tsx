"use client";

import styled from "styled-components";
import { mono } from "../../styles";

const TWO_COLUMNS =
  "(min-width: 900px), (min-width: 600px) and (orientation: landscape)";
const WIDE = "(min-width: 1100px)";

/*
 * One project = one screen: the section is at least as tall as the viewport and
 * the frame takes whatever the meta, the name and the text leave, so nothing is
 * measured in advance. --p (reveal) and --q (mockup build) go from 0 to 1 as the
 * project scrolls in; the scene sets them.
 */
export const Case = styled.section<{ $accent: string }>`
  --c: ${({ $accent }) => $accent};
  --p: 1;
  display: flex;
  flex-direction: column;
  min-block-size: 100svh;
  border-block-start: 1px solid var(--color-line);
  padding-block: clamp(1rem, 5svh, 2.5rem) clamp(1.5rem, 8svh, 4.5rem);
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

/* A dot never starts a line: it is glued to the word before it, and it always shows. */
export const Languages = styled.span`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;

  span:not(:first-child)::before {
    content: "· ";
  }
`;

export const Name = styled.h2`
  margin-block: clamp(0.5rem, 2svh, 1rem) clamp(1.5rem, 6svh, 3.5rem);
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
  transform: translateX(calc((1 - var(--p)) * 7%));
  opacity: calc(0.25 + var(--p) * 0.75);
`;

/* The body takes the rest of the screen: the frame is its stretching row */
export const Body = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(min(6rem, 14svh), 1fr) auto;
  gap: clamp(1rem, 3svh, 2.5rem) 2rem;
  align-items: end;
  min-block-size: 0;

  @media ${TWO_COLUMNS} {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    grid-template-rows: minmax(min(6rem, 14svh), 1fr);
  }
`;

/* Every project lays out the same way: frame on the start side, text on the end side. */
export const Frame = styled.a`
  /* The frame lifts its mockup instead of drawing a line */
  &::after {
    content: none;
  }

  position: relative;
  display: block;
  inline-size: 100%;
  block-size: 100%;
  overflow: hidden;
  background: var(--c);
  clip-path: inset(
    calc((1 - var(--p)) * 46%) calc((1 - var(--p)) * 3%) round 2px
  );

  @media ${TWO_COLUMNS} {
    grid-row: 1;
    grid-column: 1 / span 7;
    justify-self: start;
  }

  @media ${WIDE} {
    grid-column: 1 / span 8;
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

export const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 2.5svh, 1.375rem);
  min-inline-size: 0;
  /* The counter floats over the bottom start: the links stay clear of it */
  padding-block-end: calc(4rem + env(safe-area-inset-bottom, 0px));

  @media ${TWO_COLUMNS} {
    grid-row: 1;
    grid-column: 8 / span 5;
    padding-block-end: 0;
  }

  @media ${WIDE} {
    grid-column: 9 / span 4;
  }
`;

export const Tagline = styled.p`
  font-size: clamp(1.25rem, min(2.3vw, 4svh), 2.125rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--color-heading);
  text-wrap: balance;
  /* However long the sentence, it gives way so the project keeps to one screen */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;
  overflow: hidden;

  @media (max-height: 760px) {
    -webkit-line-clamp: 5;
  }

  @media (max-height: 620px) {
    -webkit-line-clamp: 4;
  }

  @media (max-height: 440px) {
    -webkit-line-clamp: 3;
  }

  @media (max-height: 400px) {
    -webkit-line-clamp: 2;
  }

  /* On the smallest phone the mockup needs the room more than the words do */
  @media (max-width: 360px) {
    -webkit-line-clamp: 3;
  }
`;

export const Detail = styled.p`
  max-inline-size: 46ch;
  color: var(--color-muted);

  @media (max-height: 700px) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }

  @media (max-height: 600px) {
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
    --line: var(--c);
  }
`;
