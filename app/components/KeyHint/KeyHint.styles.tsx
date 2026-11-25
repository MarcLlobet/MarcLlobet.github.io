"use client";

import styled from "styled-components";
import { desktopOnly, visuallyHidden } from "../../styles";

/*
 * A key cap in the label voice: same size as the text around it, a hairline
 * box. Once the keys actually work (screenStepsRuntime sets
 * data-screen-steps on <html>), the caps take the accent: the hint lights
 * up the moment you use it.
 */
export const Cap = styled.kbd`
  display: inline-grid;
  place-items: center;
  min-inline-size: 1.75em;
  block-size: 1.75em;
  padding-inline: 0.35em;
  border: 1px solid var(--color-line-strong);
  border-radius: 2px;
  font: inherit;
  letter-spacing: 0;
  color: var(--color-text);
  transition:
    border-color 0.4s ease,
    color 0.4s ease;

  :root[data-screen-steps] & {
    border-color: var(--color-accent);
  }
`;

export const Label = styled.span`
  ${visuallyHidden}
`;

/* The whole hint: a run of caps and words, never on a touch screen. */
export const Hint = styled.span`
  ${desktopOnly}
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35em 0.5em;
`;
