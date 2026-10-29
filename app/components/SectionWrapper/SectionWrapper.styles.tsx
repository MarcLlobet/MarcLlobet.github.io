"use client";

import styled from "styled-components";

export const StyledSectionWrapper = styled.section`
  /* min, not fixed: on small screens a project can be taller than the screen */
  min-block-size: 100svh;
  inline-size: 100%;
  display: flex;
  align-items: center;
  /* Leave room for the sticky nav at the top */
  padding-block: var(--nav-block-size) calc(var(--spacing) * 2);
  scroll-snap-align: start;
  /* Children size themselves against the section, not the whole screen */
  container-type: inline-size;
`;

export const InnerSectionWrapper = styled.div`
  display: grid;
  inline-size: 100%;
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    "title"
    "image"
    "text";
  gap: var(--spacing);
  align-items: start;

  @container (min-width: 36rem) {
    grid-template-columns: minmax(0, 30ch) minmax(0, 1fr);
    grid-template-areas:
      "title title"
      "text image";
    column-gap: clamp(var(--spacing), 4cqi, calc(var(--spacing) * 3));
    row-gap: calc(var(--spacing) * 1.5);
  }
`;

export const PreviewImage = styled.img`
  grid-area: image;
  justify-self: start;
  /* Keeps the aspect ratio while fitting both the column and the screen */
  inline-size: auto;
  block-size: auto;
  max-inline-size: min(100%, 650px);
  max-block-size: 55svh;
  filter: grayscale(1);
  mix-blend-mode: plus-lighter;

  html.light-theme & {
    mix-blend-mode: darken;
  }

  @container (min-width: 36rem) {
    justify-self: end;
  }
`;

export const TextWrapper = styled.div`
  grid-area: text;
  display: flex;
  flex-direction: column;
  gap: clamp(var(--spacing), 3cqi, calc(var(--spacing) * 2));
  max-inline-size: 36ch;
`;
