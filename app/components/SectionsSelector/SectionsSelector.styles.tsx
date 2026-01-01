"use client";

import styled from "styled-components";

export const SectionsSelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--spacing);
  min-inline-size: 20px;

  @media (max-width: 600px) {
    min-inline-size: 30px;
  }

  @media (orientation: landscape) and (max-height: 400px) {
    flex-direction: row;
  }
`;
