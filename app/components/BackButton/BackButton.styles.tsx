"use client";

import styled from "styled-components";
import { mono } from "../../styles";

/* Same reset NavWrapper's own Button uses: without it, a plain <button>
 * keeps the browser's native chrome (grey background, border, padding) —
 * GlobalStyles only resets button's colour, not its appearance. The
 * hover-wipe underline (GlobalStyles' button::after) still applies for
 * free once that chrome is gone, same as any other link on the site. */
export const Button = styled.button`
  ${mono}
  display: inline-flex;
  align-items: center;
  min-block-size: var(--tap-target);
  margin-block: clamp(1rem, 4svh, 2rem) 1rem;
  padding: 0;
  background: none;
  border: none;
  appearance: none;
  cursor: pointer;
  font-weight: 400;
  line-height: 1;
  color: var(--color-text);
`;
