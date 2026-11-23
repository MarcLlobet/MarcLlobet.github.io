"use client";

import styled from "styled-components";
import { mono } from "../../styles";

/* Fixed WebGL layer over the page, where the triangle is drawn */
export const Canvas = styled.canvas`
  position: fixed;
  inset: 0;
  z-index: 35;
  display: block;
  inline-size: 100%;
  block-size: 100%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.4s;

  &[data-ready] {
    opacity: 1;
  }
`;

/* Counter of the project in view; the triangle docks in its empty start */
export const Hud = styled.div`
  ${mono}
  position: fixed;
  z-index: 30;
  inset-inline-start: max(1rem, env(safe-area-inset-left, 0px));
  inset-block-end: calc(1rem + env(safe-area-inset-bottom, 0px));
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-block-size: 3rem;
  padding-block: 0.5rem;
  padding-inline: 4rem 0.75rem;
  background: var(--color-bg);
  border: 1px solid var(--color-line);
  color: var(--color-text);
  pointer-events: none;
  opacity: 0;
  transform: translateY(0.5rem);
  transition:
    opacity 0.4s,
    transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);

  &[data-on] {
    opacity: 1;
    transform: none;
  }

  /* The triangle stays in the hero then, so it needs no room here */
  @media (prefers-reduced-motion: reduce) {
    padding-inline: 0.75rem;
  }
`;

export const Count = styled.span`
  display: inline-block;
  block-size: 1.3em;
  line-height: 1.3em;
  overflow: hidden;
`;

export const Digits = styled.span`
  display: flex;
  flex-direction: column;
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
`;
