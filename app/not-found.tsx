"use client";

import styled, { keyframes } from "styled-components";
import Link from "next/link";
import { MorphShape } from "./components/MorphShape";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding: var(--spacing);
  gap: calc(var(--spacing) * 2);
  animation: ${fadeIn} 0.6s ease-out;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing);
  text-align: center;
`;

const ErrorCode = styled.h1`
  font-family: var(--stardom-stack);
  font-size: calc(1rem * var(--golden-ratio) * 6);
  line-height: 1;
  color: var(--color-heading);
  margin: 0;

  @media (max-width: 600px) {
    font-size: calc(1rem * var(--golden-ratio) * 4);
  }
`;

const HighlightZero = styled.span`
  color: var(--color-accent);
`;

const Message = styled.p`
  font-size: calc(1rem * var(--golden-ratio));
  color: var(--color-muted);
  max-width: 400px;
`;

const HomeLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: calc(var(--spacing) / 2);
  font-size: 1rem;
  color: var(--color-text);
  text-decoration: none;
  padding: calc(var(--spacing) / 2) var(--spacing);
  border: 1px solid var(--color-muted);
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
`;

const ShapeWrapper = styled.div`
  position: absolute;
  opacity: 0.15;
  z-index: -1;
`;

export default function NotFound() {
  return (
    <Container>
      <ShapeWrapper>
        <MorphShape size="big" infiniteAnimation stroke="var(--color-accent)" />
      </ShapeWrapper>
      <Content>
        <ErrorCode>
          4<HighlightZero>0</HighlightZero>4
        </ErrorCode>
        <Message>Not found</Message>
        <HomeLink href="/">Go home</HomeLink>
      </Content>
    </Container>
  );
}
