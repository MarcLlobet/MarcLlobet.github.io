"use client";

import styled, { css } from "styled-components";

const mono = css`
  font-family: var(--mono-stack);
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  gap: clamp(3rem, 10svh, 4.5rem);
  border-block-start: 1px solid var(--color-line);
  padding-block: clamp(4rem, 14svh, 7rem) 2.5rem;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
`;

const Eyebrow = styled.p`
  ${mono}
  color: var(--color-muted);
`;

const HELLO = "Say hello";

const Hello = styled.a`
  display: block;
  margin-block-start: 1rem;
  font-size: clamp(3.5rem, min(11vw, 20svh), 10.5rem);
  line-height: 0.9;
  font-weight: 500;
  letter-spacing: -0.05em;
  color: var(--color-heading);

  span {
    display: inline-block;
    transition:
      transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
      color 0.3s;
  }

  ${[...HELLO].map(
    (_, i) => css`
      span:nth-child(${i + 1}) {
        transition-delay: ${i * 30}ms;
      }
    `,
  )}

  &:hover {
    color: var(--color-heading);
  }

  &:hover span {
    transform: translateY(-10%);
    color: var(--scene-accent);
  }
`;

/* The impossible triangle lands here at the end of the page */
const Slot = styled.div`
  inline-size: clamp(8rem, 22vw, 18rem);
  aspect-ratio: 1.1 / 1;
  flex: none;
`;

const Bottom = styled.div`
  ${mono}
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem 1.75rem;
  color: var(--color-muted);
`;

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0 1.75rem;

  a {
    display: inline-flex;
    align-items: center;
    min-block-size: var(--tap-target);
  }
`;

export type SiteFooterProps = {
  id: string;
  slotId: string;
  githubUrl: string;
};

export const SiteFooter = ({ id, slotId, githubUrl }: SiteFooterProps) => (
  <Footer id={id}>
    <Top>
      <div>
        <Eyebrow>Get in touch</Eyebrow>
        <Hello href={githubUrl} target="_blank" rel="noopener noreferrer">
          {[...HELLO].map((letter, i) => (
            <span key={i}>{letter === " " ? " " : letter}</span>
          ))}
        </Hello>
      </div>
      <Slot id={slotId} aria-hidden="true" />
    </Top>
    <Bottom>
      <span>Data from the GitHub API · Next.js</span>
      <Links>
        <a href={githubUrl} target="_blank" rel="noopener noreferrer">
          GitHub ↗
        </a>
        <a href="#top">Back to top ↑</a>
      </Links>
    </Bottom>
  </Footer>
);
