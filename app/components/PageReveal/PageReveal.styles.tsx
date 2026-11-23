"use client";

import styled from "styled-components";
import { REVEAL_MS } from "../../utils/pageTransition";

/*
 * Grows from --vt-x/--vt-y on mount, set by the nav link that was clicked
 * (app/utils/pageTransition.ts). Those coordinates are viewport-absolute px,
 * but this element isn't full-viewport — the persistent header sits above
 * it — so PageReveal.tsx re-expresses them relative to this element's own
 * box before the transition starts (see localiseOrigin there).
 */
export const StyledReveal = styled.div<{ $revealed: boolean }>`
  clip-path: circle(
    ${(props) => (props.$revealed ? "150%" : "0%")} at var(--vt-x) var(--vt-y)
  );
  transition: clip-path ${REVEAL_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1);
`;
