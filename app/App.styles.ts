"use client";

import styled, { keyframes } from "styled-components";

const toHeavyFontWeightAnimation = keyframes`
  0% { font-weight: 300; }
  100% { font-weight: 900; }
`;

const AnimationWrapper = styled.span`
  animation-name: ${toHeavyFontWeightAnimation};
  animation-duration: 2s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  animation-fill-mode: forwards;
  display: inline-flex;
`;

export const FirstNameWrapper = styled(AnimationWrapper)`
  animation-direction: reverse;
`;
export const SurnameWrapper = styled(AnimationWrapper)`
  animation-direction: normal;
`;

export const NameWrapper = styled.h1`
  display: flex;
  flex-direction: column;
  inline-size: 100%;
  /* Scales with the screen width, but never taller than ~1/6 of the screen
     so it also fits on landscape phones */
  font-size: clamp(3rem, min(15vw, 17svh), 6.5rem);
  line-height: 0.875;
`;

export const HeroWrapper = styled.hgroup`
  grid-area: hero;
  display: flex;
  align-items: center;
  min-inline-size: 0;
  min-block-size: calc(100svh - var(--nav-block-size));
  margin: 0;
  padding-block: var(--space-s);
`;

const CircularAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const CircularShape = styled.div`
  grid-area: shape;
  align-self: start;
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: var(--shape-size);
  block-size: var(--shape-size);
  margin-block-start: calc(
    (100svh - var(--nav-block-size) - var(--shape-size)) / 2
  );
  color: var(--color-muted);
  position: sticky;
  inset-block-start: calc(50svh - var(--shape-size) / 2);
  z-index: 0;
  pointer-events: none;

  /* Portrait phones: no room beside the name, so it rests under it */
  @media (max-width: 599px) and (orientation: portrait) {
    grid-area: hero;
    align-self: end;
    justify-self: end;
    position: static;
    margin-block: 0 var(--space-l);
  }

  @media (prefers-reduced-motion: reduce) {
    position: static;
  }
`;

export const CircularShapeWrapper = styled.div`
  display: flex;

  /* The rotation lives inside the SVG, so it never changes the layout box
     (rotating the box itself made it stick out of the screen). */
  svg {
    overflow: visible;
  }

  path {
    transform-box: view-box;
    transform-origin: 50% 70%;
    animation: ${CircularAnimation} 5s linear infinite;
  }
`;

export const AsideWrapper = styled.aside`
  flex-shrink: 0;
  block-size: 100svh;
  padding-block: var(--space-rail);
  display: flex;
  position: sticky;
  inset-block-start: 0;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

export const AsideLeftWrapper = styled.div`
  display: flex;
  max-block-size: 100%;
`;

export const MainWrapper = styled.div`
  flex: 1;
  min-inline-size: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto auto 1fr;
  grid-template-areas:
    "nav"
    "hero"
    "page";

  /* Wider screens: the shape gets its own column and follows the scroll
     without covering the projects */
  @media (min-width: 600px), (orientation: landscape) {
    grid-template-columns: minmax(0, 1fr) var(--shape-size);
    column-gap: var(--space-gutter);
    grid-template-areas:
      "nav nav"
      "hero shape"
      "page shape";
  }
`;

export const WindowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  /* The rail sits one gutter from the edge and one gutter from the content */
  gap: var(--space-s) var(--space-gutter);
  inline-size: 100%;
  min-inline-size: 0;
`;

export const HighlightLetter = styled.span`
  color: var(--color-accent);
`;
