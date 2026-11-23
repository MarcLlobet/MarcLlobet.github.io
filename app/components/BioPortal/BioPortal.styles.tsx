"use client";

import styled from "styled-components";
import { StyledNavWrapper } from "../NavWrapper";
import { mono } from "../../styles";
import { REVEAL_MS } from "../../utils/pageTransition";

/*
 * Opens as a circle growing from, or closes as one collapsing into, whichever
 * button triggered it: setTransitionOrigin sets --vt-x/--vt-y to that
 * button's centre just before $revealed flips. A plain CSS transition, so it
 * works in every browser and is already covered by the global
 * prefers-reduced-motion override.
 */
export const BioPortalWrapper = styled.div<{ $revealed: boolean }>`
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
  clip-path: circle(
    ${(props) => (props.$revealed ? "150%" : "0%")} at var(--vt-x) var(--vt-y)
  );
  pointer-events: ${(props) => (props.$revealed ? "auto" : "none")};
  transition: clip-path ${REVEAL_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1);
`;

/* A plain text button, so it gets the exact same hover/focus treatment as
   every other nav button instead of a one-off icon and colour. */
export const CloseButton = styled.button`
  ${mono}
  display: flex;
  align-items: center;
  justify-content: center;
  min-inline-size: var(--tap-target);
  min-block-size: var(--tap-target);
  padding-inline: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  appearance: none;
  font-weight: 400;
  color: var(--color-text);
`;

export const StyledAboutNav = styled(StyledNavWrapper)`
  flex-shrink: 0;
  justify-content: space-between;
`;

export const NavLabel = styled.span`
  ${mono}
  color: var(--color-muted);
`;

export const CloseGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const EscHint = styled.span`
  ${mono}
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  color: var(--color-muted);
  border: 1px solid var(--color-line-strong);
  border-radius: 3px;
  padding: 0.2rem 0.45rem;
`;
