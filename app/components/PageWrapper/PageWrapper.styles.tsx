"use client";

import styled, { keyframes } from "styled-components";

const toVisible = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

export const ScreenWrapper = styled.div`
  opacity: 0;
  animation: ${toVisible} 300ms ease-in forwards 2s;
  grid-area: page;
  display: flex;
  flex-direction: row;
  inline-size: 100%;
  min-inline-size: 0;
`;

export const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  inline-size: 100%;
`;

export const MainWrapper = styled.main`
  display: flex;
  flex-direction: column;
  inline-size: 100%;
  /* Sections lay themselves out against this column's width */
  container-type: inline-size;
`;

export const Footer = styled.footer`
  padding-block-end: var(--space-s);
  padding-block-start: var(--space-3xs);
  position: sticky;
  inset-block-end: 0;
  display: flex;
  gap: var(--space-s);
  align-items: center;
  justify-content: flex-end;
  z-index: 1;
  inline-size: 100%;
`;

const revealOnScroll = keyframes`
  from {
    opacity: 0;
    visibility: hidden;
  }
  to {
    opacity: 1;
    visibility: visible;
  }
`;

/* A link to #top. It fades in once you are halfway down the page, driven by
   the scroll position in CSS; browsers without scroll-driven animations
   simply always show it. */
export const ScrollToTopButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-inline-size: var(--tap-target);
  min-block-size: var(--tap-target);
  color: var(--color-muted);

  &:hover {
    color: var(--color-accent-text);
  }

  svg {
    inline-size: 1.5rem;
    block-size: 1.5rem;
  }

  @supports (animation-timeline: scroll()) {
    animation: ${revealOnScroll} linear both;
    animation-timeline: scroll(root block);
    animation-range: 40% 55%;
  }
`;
