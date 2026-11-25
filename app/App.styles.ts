"use client";

import styled, { keyframes } from "styled-components";
import { mono } from "./styles";

/*
 * One screen minus the site's own header above it (fixed height, no longer
 * shrinking on scroll): tagline, name/triangle and bio/facts all land
 * within it, the gap distributing whatever room is left between the three
 * rows rather than inflating the section past what's actually left of the
 * viewport. scroll-margin-block-start matches the header's height too, so
 * jumping here via an anchor link doesn't land with its top hidden under it.
 */
export const HeroSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: clamp(1rem, 3svh, 2rem);
  block-size: calc(100svh - 3.5rem);
  padding-block: clamp(1rem, 4svh, 2rem);
  scroll-margin-block-start: 3.5rem;
`;

/* The tagline alone, full width, above the name/triangle row. */
export const Tagline = styled.p`
  font-size: clamp(1.375rem, 2.2vw, 1.875rem);
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: var(--color-heading);
  text-wrap: balance;
  max-inline-size: 34ch;
`;

export const HeroMiddle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  font-size: clamp(2.5rem, min(7vw, 10svh), 5.5rem);
  line-height: 1.1;
  font-weight: 500;
  letter-spacing: -0.04em;
  color: var(--color-heading);
  padding-block-end: 0.05em;
`;

export const NameLine = styled.span`
  display: block;
  overflow: hidden;
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

/* The bio's detail (left) and the facts (right) — no divider against the
 * row above: the section's own gap already separates the three rows. */
export const HeroBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 2rem;
  animation: ${fade} 1s ease 0.7s both;
`;

export const PitchDetail = styled.p`
  max-inline-size: 34ch;
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
 * Each project reveals itself by sliding in from its own side, so a title
 * that has not arrived yet sits outside the column: clipped here, it never
 * widens the page. The position/z-index/background/overlap that let Archive
 * cover its tail end are applied in JS, by useOverlapStack.
 */
export const Projects = styled.section`
  overflow: clip visible;
`;

/* The compact row — eyebrow and detail — sits above the big title. */
export const ProjectsHeader = styled.div`
  ${mono}
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem 1.5rem;
  padding-block: 0.75rem;
  border-block-end: 1px solid var(--color-line);
  color: var(--color-muted);
`;

/* Same scale as Archive's own title: Projects is a chapter like any other. */
export const Title = styled.h2`
  margin-block: clamp(1.5rem, 5svh, 3rem);
  padding-block: 0;
  font-family: var(--font-sans);
  font-size: clamp(3.5rem, min(9vw, 16svh), 8.5rem);
  line-height: 0.9;
  font-weight: 500;
  letter-spacing: -0.05em;
  color: var(--color-heading);
`;

export const EmptyProjects = styled.p`
  border-block-start: 1px solid var(--color-line);
  padding-block: clamp(2rem, 8svh, 4rem);
  max-inline-size: 46ch;
  color: var(--color-muted);
`;
