"use client";

import styled, { keyframes } from "styled-components";
import { mono } from "./styles";

export const HeroSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 7svh, 3.5rem);
  padding-block: clamp(2rem, 10svh, 8rem) clamp(3rem, 10svh, 7rem);
`;

export const HeroTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 2rem;
`;

export const NameGroup = styled.hgroup`
  margin: 0;
  min-inline-size: 0;
`;

export const Name = styled.h1`
  margin: 0;
  font-family: var(--font-sans);
  font-size: clamp(4.5rem, min(15vw, 22svh), 14.5rem);
  line-height: 0.86;
  font-weight: 500;
  letter-spacing: -0.055em;
  color: var(--color-heading);
`;

export const NameLine = styled.span`
  display: block;
  overflow: hidden;
  padding-block-end: 0.05em;
`;

const rise = keyframes`
  from { transform: translateY(108%); }
`;

export const Letter = styled.span<{ $i: number }>`
  display: inline-block;
  animation: ${rise} 1.1s cubic-bezier(0.2, 0.8, 0.2, 1) both;
  animation-delay: ${({ $i }) => $i * 45 + 120}ms;
`;

/* The room the impossible triangle lands in; the scene draws it over this */
export const ShapeSlot = styled.div`
  inline-size: clamp(150px, 26vw, 360px);
  aspect-ratio: 1.1 / 1;
  flex: none;
`;

const fade = keyframes`
  from { opacity: 0; transform: translateY(0.75rem); }
`;

export const HeroBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 2rem;
  border-block-start: 1px solid var(--color-line);
  padding-block-start: 2rem;
  animation: ${fade} 1s ease 0.7s both;
`;

/* The bio's tagline (bold) and detail (muted) stack together, the same
   split and treatment splitDescription already gives a project's own text. */
export const PitchGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-inline-size: 34ch;
`;

export const Pitch = styled.p`
  font-size: clamp(1.375rem, 2.2vw, 1.875rem);
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: var(--color-heading);
  text-wrap: balance;
`;

export const PitchDetail = styled.p`
  font-size: clamp(1.375rem, 2.2vw, 1.875rem);
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: var(--color-muted);
  text-wrap: balance;
`;

/* What the page holds and what it is made of, straight from the data */
export const Facts = styled.dl`
  ${mono}
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.5rem 1.5rem;
  margin: 0;
  max-inline-size: 46ch;

  dt {
    color: var(--color-muted);
  }

  dd {
    margin: 0;
    text-wrap: balance;
  }
`;

/*
 * Each project reveals itself by sliding in from its own side, so a title that
 * has not arrived yet sits outside the column: clipped here, it never widens
 * the page.
 */
export const Projects = styled.main`
  display: flex;
  flex-direction: column;
  overflow: clip visible;
`;

export const SectionHead = styled.p`
  ${mono}
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  padding-block-end: 1rem;
  color: var(--color-muted);
`;

export const EmptyProjects = styled.p`
  border-block-start: 1px solid var(--color-line);
  padding-block: clamp(2rem, 8svh, 4rem);
  max-inline-size: 46ch;
  color: var(--color-muted);
`;
