"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { StyledNavWrapper, Button } from "./NavWrapper.styles";
import { setTransitionOrigin } from "../../utils/pageTransition";
import { toggleTheme, useIsLightTheme } from "../../utils/theme";

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

/**
 * Lives in the root layout, so it's never remounted between pages — every
 * link here is a real, basePath-aware next/link; PageReveal (also in the
 * layout) plays the actual page-to-page transition.
 */
export const NavWrapper = ({ hasArchive = false }: NavWrapperProps) => {
  const isLight = useIsLightTheme();

  return (
    <StyledNavWrapper>
      <Button as={Link} href="/#work" onClick={recordOrigin}>
        Work
      </Button>
      {hasArchive && (
        <Button as={Link} href="/#archive" onClick={recordOrigin}>
          Archive
        </Button>
      )}
      <Button as={Link} href="/about" onClick={recordOrigin}>
        About
      </Button>
      <Button type="button" onClick={toggleTheme} aria-pressed={isLight}>
        Theme
      </Button>
      <Button as={Link} href="/design" onClick={recordOrigin}>
        Design ↗
      </Button>
    </StyledNavWrapper>
  );
};
