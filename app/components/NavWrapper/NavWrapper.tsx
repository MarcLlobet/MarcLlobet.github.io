"use client";

import { useEffect, useState, Suspense, lazy, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { StyledNavWrapper, Button, LinkButton } from "./NavWrapper.styles";
import { setTransitionOrigin } from "../../utils/pageTransition";
import { toggleTheme, useIsLightTheme } from "../../utils/theme";
import type { Repository } from "../../types";

const loadBioPortal = () =>
  import("../BioPortal").then((mod) => ({ default: mod.BioPortal }));

const LazyBioPortal = lazy(loadBioPortal);

export type NavWrapperProps = {
  bio: string;
  repositories: Repository[];
  githubUrl: string;
  /** Show the Archive link (only when the page has an archive). */
  hasArchive?: boolean;
};

/**
 * /about is a real, directly-linkable page (app/about/page.tsx). Opening it
 * from here instead overlays it on the still-visible home page and syncs the
 * address bar by hand (pushState/popstate), so the URL stays real and
 * shareable without Next needing to unmount this page — static export
 * doesn't support Intercepting Routes, which would otherwise do this for us.
 */
export const NavWrapper = ({
  bio,
  repositories,
  githubUrl,
  hasArchive = false,
}: NavWrapperProps) => {
  const [showBio, setShowBio] = useState(false);
  const isLight = useIsLightTheme();

  // Idle-preload the bio bundle so opening it never has to wait on the network.
  useEffect(() => {
    const idle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback
        : (callback: () => void) => window.setTimeout(callback, 1);
    idle(() => {
      // Best-effort: if the preload fails (e.g. flaky connection), the real
      // click still triggers React.lazy's own, retried, import.
      loadBioPortal().catch(() => {});
    });
  }, []);

  useEffect(() => {
    const syncToUrl = () => setShowBio(window.location.pathname === "/about");
    window.addEventListener("popstate", syncToUrl);
    return () => window.removeEventListener("popstate", syncToUrl);
  }, []);

  const openAbout = (event: MouseEvent<HTMLAnchorElement>) => {
    const modified =
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey;
    if (modified) return; // let a modified click (e.g. open in new tab) through
    event.preventDefault();
    setTransitionOrigin(event.currentTarget);
    window.history.pushState(null, "", "/about");
    setShowBio(true);
  };

  const closeAbout = () => {
    if (window.location.pathname === "/about") window.history.back();
  };

  return (
    <StyledNavWrapper>
      <LinkButton href="#work">Work</LinkButton>
      {hasArchive && <LinkButton href="#archive">Archive</LinkButton>}
      <Button as={Link} href="/about" onClick={openAbout}>
        About
      </Button>
      <Button type="button" onClick={toggleTheme} aria-pressed={isLight}>
        Theme
      </Button>
      <LinkButton href="design">Design ↗</LinkButton>
      {showBio &&
        createPortal(
          <Suspense fallback={null}>
            <LazyBioPortal
              bio={bio}
              repositories={repositories}
              githubUrl={githubUrl}
              onClose={closeAbout}
            />
          </Suspense>,
          document.body,
        )}
    </StyledNavWrapper>
  );
};
