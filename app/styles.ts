"use client";

import { css } from "styled-components";

/** The eyebrow/label voice used for counters, nav links and metadata. */
export const mono = css`
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

/*
 * The "next section slides up and covers the previous one" stacking effect
 * (Projects/Archive/Meta/Contact) is applied in JS — see useOverlapStack —
 * as direct inline styles rather than here, so it can't be silently
 * overridden by stylesheet ordering.
 */
