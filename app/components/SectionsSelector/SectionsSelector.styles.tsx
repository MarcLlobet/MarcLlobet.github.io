"use client";

import styled from "styled-components";

export const SectionsSelectorWrapper = styled.div<{ $sections: number }>`
  --sections: ${({ $sections }) => $sections};
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-inline-size: var(--selector-size);
  max-block-size: 100%;
  gap: clamp(
    2px,
    (
        100svh - var(--space-rail) * 2 - var(--sections, 1) *
          var(--selector-size)
      ) /
      max(var(--sections, 1) - 1, 1),
    var(--space-s)
  );
  overflow: auto;
  scrollbar-width: none;
`;
