"use client";

import styled from "styled-components";

export const StyledSectionWrapper = styled.section`
  block-size: 100dvh;
  inline-size: 100%;
  display: flex;
  align-items: center;
  scroll-snap-align: start;
`;

export const InnerSectionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  @media (orientation: landscape) and (max-height: 400px) {
    padding-block-start: 4dvw;
  }
`;

export const PreviewImage = styled.img`
  filter: grayscale(1);
  inline-size: calc(100% - 30ch - 4dvw);
  max-inline-size: 650px;
  object-fit: cover;
  object-position: center;
  padding-block-end: 3dvh;
  mix-blend-mode: plus-lighter;
  order: 1;
  padding-block-end: 0;

  html.light-theme & {
    mix-blend-mode: darken;
  }

  @media (max-width: 900px) {
    order: 0;
    inline-size: 100%;
    padding-block-end: 0;
    max-inline-size: 450px;
  }

  @media (orientation: landscape) and (max-height: 400px) {
    max-inline-size: 250px;
    order: 1;
  }
`;

export const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  inline-size: 30ch;

  @media (max-width: 900px) {
    gap: 1rem;
    inline-size: 100%;
    max-inline-size: 32ch;
  }
`;
