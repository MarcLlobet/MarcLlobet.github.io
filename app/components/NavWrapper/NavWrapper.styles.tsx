"use client";

import styled from "styled-components";

export const StyledNavWrapper = styled.nav`
  padding-block: var(--spacing);
  position: sticky;
  top: 0;
  display: flex;
  gap: var(--spacing);
  align-items: center;
  justify-content: flex-end;
  z-index: 1;
  inline-size: 100%;

  @media (orientation: landscape) and (max-height: 400px) {
    margin-block-end: 30px;
  }
`;

export const Button = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  line-height: var(--spacing);
  padding: 0;
  appearance: none;
  font-family: inherit;
  cursor: pointer;
  font-weight: 500;

  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
`;

export const LinkButton = styled(Button).attrs({ as: "a" })``;
