"use client";

import styled from "styled-components";

/* One project = one screen. Title and text keep their size; the preview
   takes whatever space is left. The section only grows past the screen
   if the text alone does not fit. */
export const StyledSectionWrapper = styled.section`
  min-block-size: 100svh;
  inline-size: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto minmax(0, 1fr) auto;
  grid-template-areas:
    "title"
    "image"
    "text";
  gap: clamp(0.75rem, 2svh, calc(var(--spacing) * 1.5));
  /* Leave room for the sticky nav at the top */
  padding-block: var(--nav-block-size) clamp(1rem, 4svh, 3rem);
  scroll-snap-align: start;

  /* The query container is <main>, so this follows the column width */
  @container (min-width: 36rem) {
    grid-template-columns: minmax(0, 36ch) minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr);
    grid-template-areas:
      "title title"
      "text image";
    column-gap: clamp(var(--spacing), 4cqi, calc(var(--spacing) * 3));
  }
`;

/* Kept for the markup; the grid lives on the section */
export const InnerSectionWrapper = styled.div`
  display: contents;
`;

export const PreviewFrame = styled.div`
  grid-area: image;
  position: relative;
  min-block-size: 0;
  max-inline-size: 650px;
  inline-size: 100%;
  /* Reports no size of its own, so it only gets the space that is left */
  contain: size;

  @container (min-width: 36rem) {
    justify-self: end;
  }

  /* Short portrait phones: too little room left to show a useful preview */
  @media (orientation: portrait) and (max-height: 600px) {
    display: none;
  }
`;

export const PreviewImage = styled.img`
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  object-fit: contain;
  object-position: left center;
  filter: grayscale(1);
  mix-blend-mode: plus-lighter;

  html.light-theme & {
    mix-blend-mode: darken;
  }

  @container (min-width: 36rem) {
    object-position: right center;
  }
`;

export const TextWrapper = styled.div`
  grid-area: text;
  align-self: center;
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 2.5svh, calc(var(--spacing) * 2));
  max-inline-size: 36ch;
`;
