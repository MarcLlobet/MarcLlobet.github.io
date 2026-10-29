"use client";

import styled from "styled-components";
import { StyledNavWrapper } from "../NavWrapper";

export const BioPortalWrapper = styled.div<{ $showBio: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-inline: max(var(--space-gutter), env(safe-area-inset-left))
    max(var(--space-gutter), env(safe-area-inset-right));
  overflow: auto;
  overscroll-behavior: contain;
  background-color: var(--color-bg);
  color: var(--color-accent-text);
  opacity: ${(props) => (props.$showBio ? 1 : 0)};
  pointer-events: ${(props) => (props.$showBio ? "auto" : "none")};
  transition: opacity 150ms ease-in-out;
`;

export const CloseButton = styled.button<{ $showBio: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-inline-size: var(--tap-target);
  min-block-size: var(--tap-target);
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
  gap: 1em;
  flex-shrink: 0;
  min-block-size: calc(100svh - var(--nav-block-size));
  padding-block: var(--space-s) var(--space-xl);
  font-size: clamp(1.25rem, 0.9rem + 2vmin, 2rem);

  p {
    max-inline-size: 32ch;
  }
`;

export const StyledAboutNav = styled(StyledNavWrapper)`
  flex-shrink: 0;
`;
