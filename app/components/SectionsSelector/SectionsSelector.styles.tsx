"use client";

import styled from "styled-components";

export const SectionsSelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-inline-size: var(--selector-size);
  max-block-size: 100%;
  /* Shrink the gap so every selector fits, even on a landscape phone */
  gap: clamp(
    2px,
    (100svh - var(--spacing) * 2 - var(--sections, 1) * var(--selector-size)) /
      max(var(--sections, 1) - 1, 1),
    var(--spacing)
  );
  /* Last resort when there are too many projects to fit */
  overflow-y: auto;
  scrollbar-width: none;
`;
