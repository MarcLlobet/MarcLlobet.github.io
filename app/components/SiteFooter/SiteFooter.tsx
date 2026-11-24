"use client";

import styled, { css } from "styled-components";
import { mono } from "../../styles";
import { copy } from "../../content/copy";
import { useCopy } from "../../utils/copy";

/*
 * One screen minus the site's own header above it, same as Hero: the gap
 * distributes whatever room is left between the three rows rather than
 * inflating the section past what's actually left of the viewport. The
 * position/z-index/background/overlap that let this cover Meta's tail end
 * are applied in JS, by useOverlapStack.
 */
const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: clamp(1.5rem, 4svh, 3rem);
  block-size: calc(100svh - 3.5rem);
  padding-block: clamp(1rem, 4svh, 2rem);
  scroll-margin-block-start: 3.5rem;
`;

/* The compact row — eyebrow and detail — sits above the big "Say hello". */
const Header = styled.div`
  ${mono}
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  padding-block: 0.75rem;
  border-block-end: 1px solid var(--color-line);
  color: var(--color-muted);
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
`;

/* Baked into Hello's per-letter transition delays below, so it has to stay
 * the static core string — not the (possibly still-loading) hook value. */
const HELLO = copy["footer.hello"];

const Hello = styled.a`
  display: block;
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

  &::after {
    content: none;
  }

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
  inline-size: clamp(150px, 26vw, 360px);
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

export const SiteFooter = ({ id, slotId, githubUrl }: SiteFooterProps) => {
  const { t } = useCopy();
  return (
    <Footer id={id}>
      <Header>
        <span>{t("footer.getInTouch")}</span>
        <span>{t("footer.detail")}</span>
      </Header>
      <Top>
        <div>
          <Hello href={githubUrl} target="_blank" rel="noopener noreferrer">
            {[...HELLO].map((letter, i) => (
              <span key={i}>{letter === " " ? " " : letter}</span>
            ))}
          </Hello>
        </div>
        <Slot id={slotId} aria-hidden="true" />
      </Top>
      <Bottom>
        <span>{t("footer.dataFrom")}</span>
        <Links>
          <a href={githubUrl} target="_blank" rel="noopener noreferrer">
            {t("footer.githubLabel")}
          </a>
          <a href="#hero">{t("footer.backToTop")}</a>
        </Links>
      </Bottom>
    </Footer>
  );
};
