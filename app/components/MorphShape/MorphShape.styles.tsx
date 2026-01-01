"use client";

import styled from "styled-components";

export const StyledMorphShape = styled.svg<{ $isSmall: boolean }>`
  display: inline-block;
  transform: rotate(90deg);
  inline-size: ${({ $isSmall }) => ($isSmall ? 20 : 150)}px;
  block-size: ${({ $isSmall }) => ($isSmall ? 20 : 150)}px;
  will-change: animate, transform;

  @media (max-width: 600px) {
    inline-size: ${({ $isSmall }) => ($isSmall ? 30 : 100)}px;
    block-size: ${({ $isSmall }) => ($isSmall ? 30 : 100)}px;
  }

  @media (min-width: 1000px) {
    transform: scale(1.2);
    transition: transform 0.4s ease;
  }
`;
