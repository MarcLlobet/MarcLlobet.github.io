"use client";

import styled from "styled-components";

export const StyledSectionSelector = styled.a<{ $isSelected: boolean }>`
  display: inline-flex;

  color: ${(props) =>
    props.$isSelected ? "var(--color-accent)" : "var(--color-muted)"};

  transition: color 150ms ease-in-out;

  svg {
    color: currentColor;
  }
`;
