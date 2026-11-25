"use client";

import styled from "styled-components";
import { REVEAL_MS } from "../../utils/pageTransition";

export type RevealPhase = "hidden" | "revealing" | "settled";

/*
 * Grows from --vt-x/--vt-y on mount, set by the nav link that was clicked
 * (app/utils/pageTransition.ts). Those coordinates are viewport-absolute px,
 * but this element isn't full-viewport — the persistent header sits above
 * it — so PageReveal.tsx re-expresses them relative to this element's own
 * box before the transition starts (see localiseOrigin there).
 *
 * Three phases, not a boolean, because no single circle size is right for
 * both the animation and the end state:
 *  - "hidden"/"revealing" use a radius in vmax (viewport-relative), not a
 *    percentage — a percentage circle() radius resolves against
 *    sqrt(width² + height²) / 2 of THIS element's own box, the whole
 *    page's content (many viewport heights for the home page), not the
 *    viewport actually on screen. That makes even a small percentage
 *    already far bigger than the visible window, so the grow reads as
 *    instant instead of real motion.
 *  - but that same vmax size is a FIXED pixel radius once reached, and a
 *    page taller than it (any project page is close; the home page is way
 *    past it) would stay permanently clipped past that distance from the
 *    origin forever — "only the first project, then a clip edge" is
 *    exactly that. "settled" drops the clip-path entirely once the grow
 *    has finished, so nothing stays clipped regardless of page height.
 */
const clipPathFor = (phase: RevealPhase) =>
  phase === "settled"
    ? "none"
    : `circle(${phase === "revealing" ? "150vmax" : "0"} at var(--vt-x) var(--vt-y))`;

export const StyledReveal = styled.div<{ $phase: RevealPhase }>`
  clip-path: ${(props) => clipPathFor(props.$phase)};
  transition: clip-path ${REVEAL_MS}ms ease-out;
`;
