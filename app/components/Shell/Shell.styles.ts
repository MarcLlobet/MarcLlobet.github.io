"use client";

import styled from "styled-components";
import { mono } from "../../styles";

/* The width every page's content lines up to, including the header above it. */
export const Page = styled.div`
  inline-size: 100%;
  min-inline-size: 0;
  max-inline-size: 90rem;
  margin-inline: auto;
`;

/*
 * Sticky so the nav (and its scroll-highlighted section links) stays
 * reachable at any scroll position. Deliberately small by default (not
 * shrinking from a larger size on scroll) — Hero and the other anchor
 * sections size themselves around this fixed height. The background is
 * solid, not bled past this box's own inline padding — but #root's own
 * gutter outside it never holds content to begin with, so there's nothing
 * for the sticky edge to visibly clip.
 *
 * Flex, not grid: a grid track stretches its item to fill it by default,
 * which would have given Brand's underline (sized to ITS OWN box) far more
 * width than its text. Flex children size to their own content instead, so
 * Brand, the centre nav and the right nav each take only what they need.
 */
export const Header = styled.header`
  position: sticky;
  inset-block-start: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-s);
  padding-block: var(--space-3xs);
  background: var(--color-bg);
  border-block-end: 1px solid var(--color-line);
`;

export const Brand = styled.a`
  ${mono}
  display: inline-flex;
  align-items: center;
  min-block-size: var(--tap-target);
  color: var(--color-text);
`;
