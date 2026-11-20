"use client";

import styled, { css } from "styled-components";

const mono = css`
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const NO_HOVER = "(hover: none), (max-width: 760px)";

export const Section = styled.section`
  border-block-start: 1px solid var(--color-line);
  padding-block: clamp(3rem, 12svh, 6rem);
`;

export const Head = styled.div`
  ${mono}
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  color: var(--color-muted);
`;

export const Title = styled.h2`
  margin-block: 1rem clamp(1.5rem, 5svh, 3rem);
  padding-block: 0;
  font-family: var(--font-sans);
  font-size: clamp(3.5rem, min(9vw, 16svh), 8.5rem);
  line-height: 0.9;
  font-weight: 500;
  letter-spacing: -0.05em;
`;

export const List = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  border-block-end: 1px solid var(--color-line);

  &:hover a,
  &:has(a:focus-visible) a {
    opacity: 0.55;
  }

  & a:hover,
  & a:focus-visible {
    opacity: 1;
  }
`;

export const Row = styled.a`
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 0.25rem 1.5rem;
  padding-block: 1.125rem;
  border-block-start: 1px solid var(--color-line);
  color: var(--color-text);
  transition: opacity 0.3s;

  &:hover {
    color: var(--color-text);
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
  font-size: clamp(1.625rem, 3.4vw, 3rem);
  line-height: 1.05;
  font-weight: 500;
  letter-spacing: -0.03em;
  overflow-wrap: anywhere;
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);

  a:hover &,
  a:focus-visible & {
    transform: translateX(1rem);
  }

  a:hover &:dir(rtl),
  a:focus-visible &:dir(rtl) {
    transform: translateX(-1rem);
  }
`;

export const RowLanguages = styled.span`
  ${mono}
  color: var(--color-muted);

  @media ${NO_HOVER} {
    grid-column: 2;
  }
`;

export const RowTagline = styled.span`
  display: none;
  grid-column: 2 / -1;
  color: var(--color-muted);

  @media ${NO_HOVER} {
    display: block;
  }
`;

/* Floating preview that follows the pointer; the scene writes its transform */
export const Float = styled.div<{ $visible: boolean; $accent: string }>`
  --c: ${({ $accent }) => $accent};
  position: fixed;
  inset-block-start: 0;
  inset-inline-start: 0;
  z-index: 40;
  inline-size: clamp(17.5rem, 26vw, 25rem);
  pointer-events: none;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.3s;
`;

export const FloatFrame = styled.div<{ $visible: boolean }>`
  position: relative;
  aspect-ratio: 2 / 1;
  overflow: hidden;
  background: var(--c);
  filter: url(#archive-ripple);
  transform: scale(${({ $visible }) => ($visible ? 1 : 0.85)});
  transition:
    transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
    background-color 0.3s;
`;

export const FloatShot = styled.div`
  position: absolute;
  inset-block: 5% 0;
  inset-inline: 5%;
`;

export const FloatCaption = styled.p`
  margin-block-start: 0.625rem;
  font-size: 0.9375rem;
  line-height: 1.3;
  color: var(--color-text);
`;
