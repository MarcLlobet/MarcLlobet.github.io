"use client";

import styled from "styled-components";
import { mono } from "../../styles";

const NO_HOVER = "(hover: none), (max-width: 760px)";

/* The position/z-index/background/overlap that let this cover Projects'
 * tail end are applied in JS, by useOverlapStack. */
export const Section = styled.section`
  padding-block-end: clamp(1.5rem, 6svh, 3rem);
`;

/* The compact row — eyebrow and detail — sits above the big title. */
export const Header = styled.div`
  ${mono}
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem 1.5rem;
  padding-block: 0.75rem;
  border-block-end: 1px solid var(--color-line);
  color: var(--color-muted);
`;

export const Title = styled.h2`
  margin-block: clamp(1.5rem, 5svh, 3rem);
  padding-block: 0;
  font-family: var(--font-sans);
  font-size: clamp(3.5rem, min(9vw, 16svh), 8.5rem);
  line-height: 0.9;
  font-weight: 500;
  letter-spacing: -0.05em;
  color: var(--color-heading);
`;

export const List = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  border-block-end: 1px solid var(--color-line);
`;

/*
 * A row reads as a line of an index until you point at it: then the rule
 * underneath draws from the start to the end in the row's own colour, and an
 * arrow comes out of the name. Leaving reverses nothing: the rule keeps going
 * and leaves through the far edge.
 */
export const Row = styled.a<{ $accent: string }>`
  --c: ${({ $accent }) => $accent};
  --line: var(--c);
  position: relative;
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 0.25rem 1.5rem;
  padding-block: 1.125rem;
  border-block-start: 1px solid var(--color-line);
  color: var(--color-text);

  /* The rule: the global line, moved to the foot of the whole row */
  &::after {
    inset-block-end: 0;
    block-size: 2px;
  }

  @media ${NO_HOVER} {
    grid-template-columns: 2.25rem minmax(0, 1fr);
  }
`;

export const RowNumber = styled.span`
  ${mono}
  color: var(--color-muted);
`;

export const RowName = styled.span`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-size: clamp(1.625rem, 3.4vw, 3rem);
  line-height: 1.05;
  font-weight: 500;
  letter-spacing: -0.03em;
  overflow-wrap: anywhere;
`;

/** The arrow that comes out of the name when the row is pointed at. */
export const RowGo = styled.span`
  font-size: 0.5em;
  /* The row's own ink: an accent this small does not carry in light theme */
  color: inherit;
  opacity: 0;
  transform: translateX(-0.5rem);
  transition:
    opacity 0.35s,
    transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);

  a:hover &,
  a:focus-visible & {
    opacity: 1;
    transform: none;
    transition-delay: 0.08s;
  }

  /* Nothing to point with: the arrow stays out, in the row's own colour */
  @media ${NO_HOVER} {
    opacity: 1;
    transform: none;
  }
`;

export const RowLanguages = styled.span`
  ${mono}
  position: relative;
  color: var(--color-muted);

  @media ${NO_HOVER} {
    grid-column: 2;
  }
`;

export const RowTagline = styled.span`
  position: relative;
  grid-column: 2 / -1;
  color: var(--color-muted);
`;
