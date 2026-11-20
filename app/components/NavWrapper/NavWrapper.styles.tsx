"use client";

import styled from "styled-components";

export const StyledNavWrapper = styled.nav`
  grid-area: nav;
  position: sticky;
  inset-block-start: 0;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 0 1.75rem;
  align-items: center;
  justify-content: flex-end;
  inline-size: 100%;
  min-block-size: var(--nav-block-size);
  background-color: var(--color-bg);
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  min-block-size: var(--tap-target);
  background: none;
  border: none;
  padding: 0;
  appearance: none;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text);
`;

export const LinkButton = styled(Button).attrs({ as: "a" })``;
