"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { CenterNav, RightNav, Button } from "./NavWrapper.styles";
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
          {t("nav.hero")}
        </Button>
        <Button
          as={Link}
          href={`/#${PROJECTS}`}
          onClick={recordOrigin}
          aria-current={isCurrent(active, PROJECTS)}
        >
          {t("nav.projects")}
        </Button>
        {hasArchive && (
          <Button
            as={Link}
            href={`/#${ARCHIVE}`}
            onClick={recordOrigin}
            aria-current={isCurrent(active, ARCHIVE)}
          >
            {t("nav.archive")}
          </Button>
        )}
        <Button
          as={Link}
          href={`/#${META}`}
          onClick={recordOrigin}
          aria-current={isCurrent(active, META)}
        >
          {t("nav.meta")}
        </Button>
        <Button
          as={Link}
          href={`/#${SITE_FOOTER}`}
          onClick={recordOrigin}
          aria-current={isCurrent(active, SITE_FOOTER)}
        >
          {t("nav.contact")}
        </Button>
      </CenterNav>
      <RightNav>
        <Button type="button" onClick={toggleTheme} aria-pressed={isLight}>
          {t("nav.theme")}
        </Button>
        <Button as={Link} href="/design" onClick={recordOrigin}>
          {t("nav.design")}
        </Button>
      </RightNav>
    </>
  );
};
