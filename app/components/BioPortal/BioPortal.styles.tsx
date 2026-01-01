"use client";

import styled from "styled-components";
import { StyledNavWrapper } from "../NavWrapper";

export const BioPortalWrapper = styled.div<{ $showBio: boolean }>`
  padding-inline-start: 5dvw;
  padding-inline-end: 5dvw;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-bg);
  color: var(--color-accent);
  width: 100dvw;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
  opacity: ${(props) => (props.$showBio ? 1 : 0)};
  pointer-events: ${(props) => (props.$showBio ? "auto" : "none")};
  transition: opacity 150ms ease-in-out;
`;

export const CloseButton = styled.button<{ $showBio: boolean }>`
  display: flex;
  align-items: flex-end;
  background: none;
  border: none;
  cursor: pointer;
  appearance: none;
  color: var(--color-accent);
`;

export const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  padding-block-end: 5dvh;
  font-size: 2rem;
  block-size: calc(100dvh - 66px);

  p {
    max-width: 32ch;

    @media (max-width: 600px) {
      font-size: 1.5rem;
    }
  }

  @media (orientation: landscape) and (max-height: 400px) {
    font-size: 1.5rem;
    padding-block-start: 0;
    justify-content: center;
  }
`;

export const StyledAboutNav = styled(StyledNavWrapper)`
  @media (orientation: landscape) and (max-height: 400px) {
    margin-block-end: 0;
  }
`;
