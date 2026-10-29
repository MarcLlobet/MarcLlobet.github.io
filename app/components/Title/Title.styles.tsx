"use client";

import styled from "styled-components";

export const StyledTitle = styled.h2<{ $longestWord: number }>`
  --longest-word: ${({ $longestWord }) => $longestWord};
  grid-area: title;
  margin: 0;
  padding-block: 0;
  line-height: 1.05;
  font-size: min(
    clamp(2rem, 1rem + 6cqi, 5rem),
    100cqi / (var(--longest-word, 10) * 0.56)
  );
  overflow-wrap: anywhere;
`;
