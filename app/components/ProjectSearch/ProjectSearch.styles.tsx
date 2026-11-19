"use client";

import styled from "styled-components";

export const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1 1 8rem;
  /* Lets the input shrink inside the nav instead of forcing it to wrap. */
  min-inline-size: 0;
  max-inline-size: 16rem;
  min-block-size: var(--tap-target);
`;

export const VisuallyHiddenLabel = styled.label`
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;

export const SearchInput = styled.input`
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: var(--tap-target);
  padding-inline: var(--space-2xs);
  background: none;
  border: none;
  border-block-end: 1px solid var(--color-muted);
  color: var(--color-text);
  font-family: inherit;
  font-size: 1rem;
  line-height: 1;
  appearance: none;

  &::placeholder {
    color: var(--color-muted);
  }

  &::-webkit-search-cancel-button {
    appearance: none;
  }
`;

export const Results = styled.ul`
  position: absolute;
  inset-block-start: 100%;
  inset-inline-start: 0;
  z-index: 3;
  /* Wider than the input when the nav squeezes it, but never past the screen. */
  inline-size: max(100%, 14rem);
  max-inline-size: 70vw;
  margin: 0;
  padding: var(--space-3xs);
  list-style: none;
  background-color: var(--color-bg);
  border: 1px solid var(--color-muted);
  overflow-wrap: anywhere;
`;

export const ResultLink = styled.a`
  display: flex;
  align-items: center;
  min-block-size: var(--tap-target);
  padding-inline: var(--space-2xs);
  color: var(--color-text);
  font-size: 1rem;
  text-decoration: none;

  &:hover,
  &:focus-visible {
    color: var(--color-accent-text);
  }
`;

export const NoResults = styled.li`
  display: flex;
  align-items: center;
  min-block-size: var(--tap-target);
  padding-inline: var(--space-2xs);
  color: var(--color-muted);
  font-size: 1rem;
`;

export const LiveRegion = styled.p`
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;
