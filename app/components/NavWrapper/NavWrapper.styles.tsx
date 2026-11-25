"use client";

import styled from "styled-components";
import { mono, visuallyHidden } from "../../styles";

/* Narrow enough, or held upright, that five section names no longer fit
 * the header comfortably — CenterNav's own links collapse to dots (see
 * Button and Label below) and the theme toggle swaps its text for an icon
 * (see ThemeIcon/ThemeText) here. Never RightNav's Design link: there's
 * only ever the one, it keeps its name. */
const COMPACT_NAV = "(orientation: portrait), (max-width: 640px)";

/* Lands in Header's centre grid track (1fr auto 1fr) — the anchor links to
 * the page's own sections, equidistant from the brand and the right-hand
 * group regardless of either one's width. */
export const CenterNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0 1.75rem;
  align-items: center;
  justify-content: center;

  @media ${COMPACT_NAV} {
    gap: 0;
  }
`;

/* Lands in Header's right grid track — links that leave the current page. */
export const RightNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0 1.75rem;
  align-items: center;
  justify-content: flex-end;
`;

/* The section name, inside a CenterNav Button — visually hidden under
 * COMPACT_NAV (still in the accessibility tree: a screen reader, or
 * Tab-focus without a pointer, gets the real name either way), replaced on
 * screen by the dot Button itself draws via ::before. */
export const Label = styled.span`
  @media ${COMPACT_NAV} {
    ${visuallyHidden}
  }
`;

/* The reverse of Label: text by default, visually hidden under
 * COMPACT_NAV once ThemeIcon (below) is there to read instead. */
export const ThemeText = styled.span`
  @media ${COMPACT_NAV} {
    ${visuallyHidden}
  }
`;

/* Sun/moon, drawn rather than an icon font — hidden until COMPACT_NAV,
 * where it replaces ThemeText. aria-hidden in the markup: ThemeText (or a
 * screen reader's own name for the button) is still the real label. */
export const ThemeIcon = styled.svg`
  display: none;
  inline-size: 1.125rem;
  block-size: 1.125rem;

  @media ${COMPACT_NAV} {
    display: block;
  }
`;

export const Button = styled.button`
  ${mono}
  display: inline-flex;
  align-items: center;
  min-block-size: var(--tap-target);
  padding: 0;
  background: none;
  border: none;
  appearance: none;
  cursor: pointer;
  font-weight: 400;
  line-height: 1;
  color: var(--color-text);

  /* The current section's link keeps the hover-wipe line permanently drawn. */
  &[aria-current="true"]::after {
    transform: scaleX(1);
    transform-origin: 0 50%;
  }

  ${CenterNav} & {
    @media ${COMPACT_NAV} {
      justify-content: center;
      min-inline-size: 1.25rem;
      min-block-size: 1.25rem;

      /* A dot stands in for the wipe-line as "this one's current" — there's
       * no label left for the line to run under. */
      &::after {
        content: none;
      }

      &::before {
        content: "";
        inline-size: 0.375rem;
        block-size: 0.375rem;
        border-radius: 50%;
        background: var(--color-line-strong);
        transition: background-color 0.3s;
      }

      &[aria-current="true"]::before {
        background: var(--color-accent);
      }
    }
  }

  /* The wipe-line reads fine under "Theme" the text (desktop) — under the
   * sun/moon icon it replaces (COMPACT_NAV), there's no word for it to run
   * under, so it's suppressed the same way the dots above suppress it. */
  &:has(${ThemeIcon}) {
    @media ${COMPACT_NAV} {
      &::after {
        content: none;
      }
    }
  }
`;
