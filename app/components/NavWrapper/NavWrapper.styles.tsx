"use client";

import styled, { css } from "styled-components";

/* The nav sits in the top row of the header, in the label typeface */
const mono = css`
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const StyledNavWrapper = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0 1.75rem;
  align-items: center;
  justify-content: flex-end;
  inline-size: 100%;
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
  font-weight: 500;
  line-height: 1;
`;

export const LinkButton = styled(Button).attrs({ as: "a" })``;
