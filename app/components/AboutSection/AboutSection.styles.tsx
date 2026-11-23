"use client";

import styled from "styled-components";
import { mono } from "../../styles";

/* A full-height moment of its own between the Hero and the work, like a
   project's own Case — the same min-block-size, the same hairline above it. */
export const Section = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(2rem, 6svh, 4rem);
  min-block-size: 100svh;
  border-block-start: 1px solid var(--color-line);
  padding-block: clamp(2rem, 8svh, 5rem);
`;

export const Eyebrow = styled.p`
  ${mono}
  color: var(--color-muted);
`;

export const Layout = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: clamp(2rem, 6vw, 5rem);
`;

export const TextColumn = styled.div`
  flex: 1 1 420px;
  min-inline-size: 0;
  max-inline-size: 40rem;
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 4svh, 2.25rem);
`;

/* The lead sentence: bigger, like a project's own tagline. */
export const Tagline = styled.p`
  margin: 0;
  max-inline-size: 38ch;
  font-size: clamp(1.5rem, 2.6vw, 2.25rem);
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--color-heading);
  text-wrap: balance;
`;

/* The sentence after it: smaller, muted — the same hierarchy a project's
   own tagline/detail split already uses. */
export const Detail = styled.p`
  margin: 0;
  max-inline-size: 38ch;
  color: var(--color-muted);
  text-wrap: balance;
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
