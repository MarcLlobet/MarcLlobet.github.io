"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import {
  CenterNav,
  RightNav,
  Button,
  Label,
  ThemeIcon,
  ThemeText,
} from "./NavWrapper.styles";
import { setTransitionOrigin } from "../../utils/pageTransition";
import { toggleTheme, useIsLightTheme } from "../../utils/theme";
import { useCopy } from "../../utils/copy";
import { useActiveSection } from "../../utils/useActiveSection";
import {
  HERO,
  PROJECTS,
  ARCHIVE,
  META,
  SITE_FOOTER,
} from "../ScrollScene/scene-ids";

export type NavWrapperProps = {
  /** Show the Archive link (only when the home page has an archive). */
  hasArchive?: boolean;
};

const isModifiedClick = (event: MouseEvent) =>
  event.button !== 0 ||
  event.metaKey ||
  event.ctrlKey ||
  event.shiftKey ||
  event.altKey;

/** Records where a nav link was clicked, so the next page's reveal grows from there. */
const recordOrigin = (event: MouseEvent<HTMLAnchorElement>) => {
  if (isModifiedClick(event)) return; // a new tab doesn't need a transition
  setTransitionOrigin(event.currentTarget);
};

const isCurrent = (active: string | null, id: string) =>
  active === id ? "true" : undefined;

/* Sun (light theme active) or moon (dark) — Feather Icons' own paths, the
 * same thin-stroke drawn-not-iconfont style as the rest of the site. */
const ThemeGlyph = ({ isLight }: { isLight: boolean }) => (
  <ThemeIcon
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {isLight ? (
      <>
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </>
    ) : (
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    )}
  </ThemeIcon>
);

/**
 * Lives in the root layout, so it's never remounted between pages — every
 * link here is a real, basePath-aware next/link; PageReveal (also in the
 * layout) plays the actual page-to-page transition. The centre group jumps
 * to the home page's own sections (and highlights whichever one is in view,
 * on whatever page that happens to be true); the right group leaves it.
 */
export const NavWrapper = ({ hasArchive = false }: NavWrapperProps) => {
  const isLight = useIsLightTheme();
  const { t } = useCopy();
  const active = useActiveSection(
    hasArchive
      ? [HERO, PROJECTS, ARCHIVE, META, SITE_FOOTER]
      : [HERO, PROJECTS, META, SITE_FOOTER],
  );

  return (
    <>
      <CenterNav>
        <Button
          as={Link}
          href={`/#${HERO}`}
          onClick={recordOrigin}
          aria-current={isCurrent(active, HERO)}
        >
          <Label>{t("nav.hero")}</Label>
        </Button>
        <Button
          as={Link}
          href={`/#${PROJECTS}`}
          onClick={recordOrigin}
          aria-current={isCurrent(active, PROJECTS)}
        >
          <Label>{t("nav.projects")}</Label>
        </Button>
        {hasArchive && (
          <Button
            as={Link}
            href={`/#${ARCHIVE}`}
            onClick={recordOrigin}
            aria-current={isCurrent(active, ARCHIVE)}
          >
            <Label>{t("nav.archive")}</Label>
          </Button>
        )}
        <Button
          as={Link}
          href={`/#${META}`}
          onClick={recordOrigin}
          aria-current={isCurrent(active, META)}
        >
          <Label>{t("nav.meta")}</Label>
        </Button>
        <Button
          as={Link}
          href={`/#${SITE_FOOTER}`}
          onClick={recordOrigin}
          aria-current={isCurrent(active, SITE_FOOTER)}
        >
          <Label>{t("nav.contact")}</Label>
        </Button>
      </CenterNav>
      <RightNav>
        <Button type="button" onClick={toggleTheme} aria-pressed={isLight}>
          <ThemeGlyph isLight={isLight} />
          <ThemeText>{t("nav.theme")}</ThemeText>
        </Button>
        <Button as={Link} href="/design" onClick={recordOrigin}>
          {t("nav.design")}
        </Button>
      </RightNav>
    </>
  );
};
