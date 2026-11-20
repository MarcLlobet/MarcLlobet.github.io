"use client";

import styled from "styled-components";
import Link from "next/link";

const Container = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  inline-size: 100%;
  max-inline-size: 90rem;
  min-block-size: 100dvh;
  margin-inline: auto;
`;

const Label = styled.p`
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-muted);
`;

const Code = styled.h1`
  margin: 0;
  font-family: var(--font-sans);
  font-size: clamp(6rem, 24vw, 18rem);
  line-height: 0.85;
  font-weight: 500;
  letter-spacing: -0.06em;
  color: var(--color-heading);
`;

const Message = styled.p`
  max-inline-size: 34ch;
  font-size: clamp(1.25rem, 2.2vw, 1.75rem);
  line-height: 1.25;
  color: var(--color-heading);
`;

const Home = styled(Link)`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  min-block-size: var(--tap-target);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text);
`;

export default function NotFound() {
  return (
    <Container>
      <Label>Error</Label>
      <Code>404</Code>
      <Message>This page is not part of the portfolio.</Message>
      <Home href="/">← Back to the projects</Home>
    </Container>
  );
}
