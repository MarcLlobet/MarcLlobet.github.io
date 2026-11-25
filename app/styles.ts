"use client";

import { css } from "styled-components";

/** The eyebrow/label voice used for counters, nav links and metadata. */
export const mono = css`
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

/** Hidden wherever there's no mouse or trackpad (phones, tablets without one). */
export const desktopOnly = css`
  @media not all and (hover: hover) and (pointer: fine) {
    display: none;
  }
`;

/** Read by screen readers, never shown. */
export const visuallyHidden = css`
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
 * The "next section slides up and covers the previous one" stacking effect
 * (Projects/Archive/Meta/Contact) is applied in JS — see useOverlapStack —
 * as direct inline styles rather than here, so it can't be silently
 * overridden by stylesheet ordering.
 */
