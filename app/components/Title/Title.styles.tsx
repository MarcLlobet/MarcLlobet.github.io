"use client";

import styled from "styled-components";

export const StyledTitle = styled.h2`
  word-wrap: break-word;
  word-break: break-word;
  inline-size: 100%;
  padding-block-end: 3rem;
  font-size: calc(1rem * var(--golden-ratio) * 3);

  @media (max-width: 900px) {
    padding-block-end: 1rem;
    font-size: calc(1rem * var(--golden-ratio) * 2);
  }
`;
