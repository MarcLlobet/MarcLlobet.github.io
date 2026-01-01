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
  font-size: calc(1rem * var(--golden-ratio) * 4);
  line-height: calc(1rem * var(--golden-ratio) * 3.5);

  @media (max-width: 600px) {
    font-size: calc(1rem * var(--golden-ratio) * 2.5);
    line-height: calc(1rem * var(--golden-ratio) * 2.25);
  }
`;

export const HeroWrapper = styled.hgroup`
  display: flex;
  inline-size: 50dvw;
  block-size: calc(100dvh - 120px);
  display: flex;
  align-items: center;
  padding-block: var(--spacing);

  @media (orientation: landscape) and (max-height: 400px) {
    inline-size: 43dvw;
  }
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
  margin-block: calc((100dvh - 120px - 150px) / 2);
  inline-size: calc(50dvw - 30px - 5rem);
  block-size: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted);
  border-radius: 50%;
  position: sticky;
  top: 40dvh;
  z-index: 1;

  @media (orientation: landscape) and (max-height: 400px) {
    top: 30dvh;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    position: static;
  }
`;

export const CircularShapeWrapper = styled.div`
  animation: ${CircularAnimation} 5s linear infinite;
  transform-origin: 30% 50%;
`;

export const AsideWrapper = styled.aside`
  block-size: 100dvh;
  padding-block: var(--spacing);
  display: flex;
  position: sticky;
  top: 0;
  justify-content: center;
  align-items: center;

  @media (orientation: landscape) and (max-height: 400px) {
    flex-direction: row;
    block-size: auto;
    inline-size: 50dvw;
    margin-inline: auto;
    z-index: 2;
  }
`;

export const AsideLeftWrapper = styled.div`
  display: flex;
`;

export const MainWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  flex-wrap: wrap;
  justify-content: space-between;

  @media (orientation: landscape) and (max-height: 400px) {
    margin-top: -60px;
  }
`;

export const WindowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--spacing) calc(var(--spacing) * 2);
  inline-size: 100%;

  @media (orientation: landscape) and (max-height: 400px) {
    flex-direction: column;
  }
`;

export const HighlightLetter = styled.span`
  color: var(--color-accent);
`;
