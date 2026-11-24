"use client";

import styled from "styled-components";
import { mono } from "../../styles";

/*
 * One screen minus the site's own header above it, same as Hero and
 * Contact: the gap distributes whatever room is left rather than inflating
 * the section past what's actually left of the viewport. The
 * position/z-index/background/overlap that let this cover Archive's tail
 * end are applied in JS, by useOverlapStack.
 */
export const Section = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: clamp(0.5rem, 2svh, 1rem);
  block-size: calc(100svh - 3.5rem);
  padding-block: clamp(1rem, 4svh, 2rem);
  scroll-margin-block-start: 3.5rem;
`;

/* The compact row — eyebrow and detail — sits above the big title. */
export const Header = styled.div`
  ${mono}
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  padding-block: 0.75rem;
  border-block-end: 1px solid var(--color-line);
  color: var(--color-muted);
`;

/*
 * Same scale as a project's Name, minus the scroll-driven pan: this title
 * never moves. The generic h2 (GlobalStyles, sized for the /design
 * showcase) carries a large fixed padding-block of its own — every other
 * Title in the codebase resets that to 0, but this one never did, which is
 * where "too much padding" was actually coming from. A small clamp()
 * replaces it instead of a flat reset: a real minimum either way, growing
 * with the viewport rather than a fixed rem value, the same approach this
 * degree of responsiveness (including mobile) needs everywhere else.
 */
export const Title = styled.h2`
  margin: 0;
  padding-block: clamp(0.5rem, 2svh, 1.5rem);
  font-family: var(--font-sans);
  font-size: clamp(2rem, min(10vw, 11svh), 9rem);
  line-height: 0.88;
  font-weight: 500;
  letter-spacing: -0.05em;
  color: var(--color-heading);
  overflow-wrap: anywhere;
  text-wrap: balance;
`;

export const Lead = styled.p`
  max-inline-size: 46ch;
  font-size: clamp(1.125rem, 1.6vw, 1.375rem);
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: var(--color-heading);
  text-wrap: balance;
`;

export const Detail = styled.p`
  max-inline-size: 46ch;
  color: var(--color-muted);
  text-wrap: balance;
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
`;
