"use client";

import styled from "styled-components";
import { mono } from "../../styles";

export const Figure = styled.figure`
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-inline-size: 0;
  min-block-size: 0;
`;

/* Carries the same meaning as the diagram, for anyone not seeing it (screen
 * reader, or a browser old enough that ResizeObserver never fires and no
 * mockup ever draws) — the Track itself is aria-hidden, this is the real
 * accessible content. */
export const VisuallyHidden = styled.ol`
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;

/*
 * One grid, not a flex row/column plus separately-aligned connectors: every
 * Frame, NodeLabel and Connector is placed on it directly (each knows its
 * own fixed DOM position — see the nth-child rules below), so a connector
 * always shares the exact column (landscape) or row (portrait) a box sits
 * in, rather than being centered across a wider area that also includes
 * the label. Landscape runs frame+label pairs down a 4-node column,
 * connectors between them in the frame column only; portrait transposes
 * that into a single frame row and a single label row across 4 node
 * columns, connectors in narrow columns between them.
 *
 * Children always come in the same repeating order — Frame, NodeLabel,
 * Connector, Frame, NodeLabel, Connector, … Frame, NodeLabel (no trailing
 * connector) — so each one's own styled-component below can target its
 * index with a plain :nth-child() instead of an inline style. Both
 * grid-row and grid-column are set together on every nth-child rule (even
 * the axis that isn't changing) so landscape and portrait stay at equal
 * selector specificity — otherwise the orientation that loses would never
 * actually override the other's placement.
 */
export const Track = styled.div`
  display: grid;
  grid-template-columns: 4.5rem 1fr;
  column-gap: 0.625rem;
  row-gap: 0.375rem;
  align-items: center;

  @media (orientation: portrait) {
    grid-template-columns: 1fr 0.875rem 1fr 0.875rem 1fr 0.875rem 1fr;
    grid-template-rows: auto auto;
    column-gap: 0.25rem;
    row-gap: 0.25rem;
  }
`;

/* Same frame a project's own mockup sits in: a bordered window, nothing
 * fancier — data-play="always" is the same attribute ProjectContent uses to
 * keep a mockup's loop animations (pulse, wave, blink…) running
 * continuously instead of only on hover. */
export const Frame = styled.div`
  position: relative;
  inline-size: 4.5rem;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 0.375rem;
  border: 1px solid var(--color-line-strong);

  &:nth-child(1) {
    grid-row: 1;
    grid-column: 1;
  }
  &:nth-child(4) {
    grid-row: 3;
    grid-column: 1;
  }
  &:nth-child(7) {
    grid-row: 5;
    grid-column: 1;
  }
  &:nth-child(10) {
    grid-row: 7;
    grid-column: 1;
  }

  @media (orientation: portrait) {
    justify-self: center;
    inline-size: 100%;
    max-inline-size: 5rem;

    &:nth-child(1) {
      grid-row: 1;
      grid-column: 1;
    }
    &:nth-child(4) {
      grid-row: 1;
      grid-column: 3;
    }
    &:nth-child(7) {
      grid-row: 1;
      grid-column: 5;
    }
    &:nth-child(10) {
      grid-row: 1;
      grid-column: 7;
    }
  }
`;

export const NodeLabel = styled.span`
  ${mono}
  font-size: 0.6875rem;
  color: var(--color-text);
  overflow-wrap: break-word;

  &:nth-child(2) {
    grid-row: 1;
    grid-column: 2;
  }
  &:nth-child(5) {
    grid-row: 3;
    grid-column: 2;
  }
  &:nth-child(8) {
    grid-row: 5;
    grid-column: 2;
  }
  &:nth-child(11) {
    grid-row: 7;
    grid-column: 2;
  }

  @media (orientation: portrait) {
    text-align: center;

    &:nth-child(2) {
      grid-row: 2;
      grid-column: 1;
    }
    &:nth-child(5) {
      grid-row: 2;
      grid-column: 3;
    }
    &:nth-child(8) {
      grid-row: 2;
      grid-column: 5;
    }
    &:nth-child(11) {
      grid-row: 2;
      grid-column: 7;
    }
  }
`;

/* Three small dots standing in for the flow between steps — the same mark
 * (var(--color-accent), the colour used anywhere something is "live") used
 * as the separator between technologies elsewhere on the site, just drawn
 * rather than the "·" character so it can rotate with the diagram. One
 * pseudo-element plus two box-shadow copies, offset along whichever axis is
 * the connecting one in this orientation. */
export const Connector = styled.div`
  justify-self: center;
  align-self: center;
  inline-size: 0.875rem;
  block-size: 0.875rem;
  position: relative;

  &:nth-child(3) {
    grid-row: 2;
    grid-column: 1;
  }
  &:nth-child(6) {
    grid-row: 4;
    grid-column: 1;
  }
  &:nth-child(9) {
    grid-row: 6;
    grid-column: 1;
  }

  &::after {
    content: "";
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: 50%;
    inline-size: 3px;
    block-size: 3px;
    border-radius: 50%;
    background: var(--color-accent);
    translate: -50% -50%;
    box-shadow:
      0 -5px 0 var(--color-accent),
      0 5px 0 var(--color-accent);
  }

  @media (orientation: portrait) {
    &:nth-child(3) {
      grid-row: 1;
      grid-column: 2;
    }
    &:nth-child(6) {
      grid-row: 1;
      grid-column: 4;
    }
    &:nth-child(9) {
      grid-row: 1;
      grid-column: 6;
    }

    &::after {
      box-shadow:
        -5px 0 0 var(--color-accent),
        5px 0 0 var(--color-accent);
    }
  }
`;
