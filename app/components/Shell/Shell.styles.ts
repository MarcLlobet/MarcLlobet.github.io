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

export const Header = styled.header`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: var(--space-s);
`;

export const Brand = styled.a`
  ${mono}
  display: inline-flex;
  align-items: center;
  min-block-size: var(--tap-target);
  color: var(--color-text);
`;
