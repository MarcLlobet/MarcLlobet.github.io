"use client";

import styled from "styled-components";
import { mono } from "../../styles";

export const Section = styled.section`
  --c: var(--color-accent);
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 2svh, 1rem);
  border-block-start: 1px solid var(--color-line);
  padding-block: clamp(1.5rem, 6svh, 3rem);
`;

export const Meta = styled.div`
  ${mono}
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  color: var(--color-muted);
`;

export const Index = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
`;

export const Dot = styled.span`
  display: inline-block;
  inline-size: 0.625rem;
  block-size: 0.625rem;
  background: var(--c);
`;

export const Languages = styled.span`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;

  span:not(:first-child)::before {
    content: "· ";
  }
`;

/* Same scale as a project's Name, minus the scroll-driven pan: this title never moves. */
export const Title = styled.h2`
  margin: 0;
  font-family: var(--font-sans);
  font-size: clamp(2rem, min(10vw, 11svh), 9rem);
  line-height: 0.88;
  font-weight: 500;
  letter-spacing: -0.05em;
  color: var(--color-heading);
  overflow-wrap: anywhere;
  text-wrap: balance;
`;

export const Lead = styled.p`
  max-inline-size: 46ch;
  font-size: clamp(1.125rem, 1.6vw, 1.375rem);
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: var(--color-heading);
  text-wrap: balance;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;

  @media (max-height: 760px) {
    -webkit-line-clamp: 3;
  }

  @media (max-height: 620px) {
    -webkit-line-clamp: 2;
  }
`;

export const Detail = styled.p`
  max-inline-size: 46ch;
  color: var(--color-muted);
  text-wrap: balance;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;

  @media (max-height: 760px) {
    -webkit-line-clamp: 2;
  }

  @media (max-height: 620px) {
    display: none;
  }
`;

export const Links = styled.p`
  ${mono}
  display: flex;
  flex-wrap: wrap;
  gap: 0 1.75rem;

  a {
    display: inline-flex;
    align-items: center;
    min-block-size: var(--tap-target);
    color: var(--color-text);
  }
`;
