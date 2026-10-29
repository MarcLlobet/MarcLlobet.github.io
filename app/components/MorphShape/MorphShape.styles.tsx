"use client";

import styled from "styled-components";

export const StyledMorphShape = styled.svg<{ $isSmall: boolean }>`
  display: inline-block;
  flex-shrink: 0;
  transform: rotate(90deg);
  inline-size: ${({ $isSmall }) =>
    $isSmall ? "var(--selector-size, 20px)" : "var(--shape-size, 150px)"};
  block-size: ${({ $isSmall }) =>
    $isSmall ? "var(--selector-size, 20px)" : "var(--shape-size, 150px)"};
`;
