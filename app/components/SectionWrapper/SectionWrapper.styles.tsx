"use client";

import styled from "styled-components";

export const StyledSectionWrapper = styled.section`
  min-block-size: 100svh;
  inline-size: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto auto auto;
  grid-template-areas:
    "title"
    "image"
    "text";
  align-content: center;
  gap: var(--space-stack);
  padding-block-start: var(--nav-block-size);
  padding-block-end: var(--space-section-end);
  scroll-snap-align: start;

  @media (max-height: 600px) {
    grid-template-rows: auto auto;
    grid-template-areas:
      "title"
      "text";
  }

  @container (min-width: 36rem) {
    grid-template-columns: minmax(0, 36ch) minmax(0, 1fr);
    grid-template-rows: auto auto;
    grid-template-areas:
      "title title"
      "text image";
    align-content: center;
    column-gap: var(--space-gutter);
  }
`;

export const InnerSectionWrapper = styled.div`
  display: contents;
`;

export const PreviewFrame = styled.div`
  grid-area: image;
  position: relative;
  min-block-size: 0;
  max-inline-size: 650px;
  inline-size: 100%;
  contain: size;
  block-size: min(56cqi, 45svh);

  @container (min-width: 36rem) {
    justify-self: end;
    block-size: auto;
  }

  @media (max-height: 600px) {
    display: none;
  }

  @container (min-width: 36rem) {
    display: block;
  }
`;

export const PreviewImage = styled.img`
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  object-fit: contain;
  object-position: left center;

  &:dir(rtl) {
    object-position: right center;
  }
  filter: grayscale(1);
  mix-blend-mode: plus-lighter;

  html.light-theme & {
    mix-blend-mode: darken;
  }

  @container (min-width: 36rem) {
    object-position: right top;

    &:dir(rtl) {
      object-position: left top;
    }
  }
`;

export const TextWrapper = styled.div`
  grid-area: text;
  align-self: center;
  display: flex;
  flex-direction: column;
  gap: var(--space-stack);
  max-inline-size: 60ch;
`;
