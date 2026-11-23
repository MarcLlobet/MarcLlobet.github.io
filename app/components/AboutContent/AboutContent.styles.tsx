"use client";

import styled from "styled-components";
import { mono } from "../../styles";

export const Title = styled.h1`
  margin: 0;
  padding-block: clamp(2rem, 9svh, 6rem) 0;
  font-family: var(--font-sans);
  font-size: clamp(3.5rem, min(13vw, 20svh), 12rem);
  line-height: 0.86;
  font-weight: 500;
  letter-spacing: -0.055em;
  color: var(--color-heading);
`;

/* Bio on the left, the repo texture docked to the right; wraps on narrow screens */
export const Layout = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: clamp(2rem, 6vw, 5rem);
  padding-block: clamp(2rem, 6svh, 3rem);
`;

export const TextColumn = styled.div`
  flex: 1 1 420px;
  min-inline-size: 0;
  max-inline-size: 40rem;
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 4svh, 2.25rem);
`;

export const Bio = styled.p`
  margin: 0;
  max-inline-size: 38ch;
  font-size: clamp(1.375rem, 2.3vw, 2rem);
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: var(--color-heading);
`;

export const Placeholder = styled.p`
  margin: 0;
  max-inline-size: 36ch;
  font-size: clamp(1.1rem, 1.6vw, 1.375rem);
  line-height: 1.5;
  font-style: italic;
  color: var(--color-muted);
  border-block-start: 1px solid var(--color-line);
  padding-block-start: clamp(1.25rem, 4svh, 2rem);
`;

export const ContactRow = styled.div`
  ${mono}
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

export const TextureSlot = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
`;

export const Cell = styled.div<{ $accent: string }>`
  inline-size: 16px;
  block-size: 16px;
  border-radius: 3px;
  background: ${(props) => props.$accent};
`;

export const Caption = styled.p`
  ${mono}
  margin: 0;
  font-size: 0.7rem;
  color: var(--color-muted);
`;
