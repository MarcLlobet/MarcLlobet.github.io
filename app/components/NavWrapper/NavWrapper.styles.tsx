"use client";

import styled from "styled-components";
import { mono } from "../../styles";

/* Lands in Header's centre grid track (1fr auto 1fr) — the anchor links to
 * the page's own sections, equidistant from the brand and the right-hand
 * group regardless of either one's width. */
export const CenterNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0 1.75rem;
  align-items: center;
  justify-content: center;
`;

/* Lands in Header's right grid track — links that leave the current page. */
export const RightNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0 1.75rem;
  align-items: center;
  justify-content: flex-end;
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
`;
