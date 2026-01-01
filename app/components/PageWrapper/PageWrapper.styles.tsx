"use client";

import styled, { keyframes } from "styled-components";

const toVisible = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

export const ScreenWrapper = styled.div`
  opacity: 0;
  animation: ${toVisible} 300ms ease-in forwards 2s;
  display: flex;
  flex-direction: row;
  top: 0;
  inline-size: 100%;
`;

export const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  inline-size: 100%;
`;

export const MainWrapper = styled.main`
  display: flex;
  flex-direction: column;
  inline-size: 100%;
  padding-block-start: 60px;
`;

export const Footer = styled.footer`
  padding-block-end: var(--spacing);
  padding-block-start: calc(var(--spacing) / 4);
  position: sticky;
  bottom: 0;
  display: flex;
  gap: var(--spacing);
  align-items: center;
  justify-content: flex-end;
  z-index: 1;
  inline-size: 100%;
`;

export const ScrollToTopButton = styled.button<{ $shouldShow: boolean }>`
  background: none;
  border: none;
  font-size: var(--spacing);
  line-height: var(--spacing);
  font-weight: 500;
  transition: opacity 300ms ease-in;
  cursor: pointer;
  pointer-events: ${(props) => (props.$shouldShow ? "auto" : "none")};
  opacity: ${(props) => (props.$shouldShow ? 1 : 0)};
  color: var(--color-muted);
  &:hover {
    color: var(--color-accent);
  }
  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;
