"use client";

import styled from "styled-components";

export const StyledNavWrapper = styled.nav`
  grid-area: nav;
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 0 var(--spacing);
  align-items: center;
  justify-content: flex-end;
  inline-size: 100%;
  min-block-size: var(--nav-block-size);
  /* Content scrolls underneath, so the bar needs its own background */
  background-color: var(--color-bg);
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  min-block-size: 2.75rem;
  background: none;
  border: none;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  appearance: none;
  font-family: inherit;
  cursor: pointer;
  font-weight: 500;
`;

export const LinkButton = styled(Button).attrs({ as: "a" })``;
