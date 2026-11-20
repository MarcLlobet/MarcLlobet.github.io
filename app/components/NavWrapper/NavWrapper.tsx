"use client";

import React, { useState, Suspense, lazy } from "react";
import { createPortal } from "react-dom";
import { StyledNavWrapper, Button, LinkButton } from "./NavWrapper.styles";
import type { Repository, Bio } from "../../types";

const LazyBioPortal = lazy(() =>
  import("../BioPortal").then((mod) => ({ default: mod.BioPortal })),
);

const whiteFavicon = "/favicon-white.svg";
const redFavicon = "/favicon-red.svg";

const toggleFavicon = () => {
  const favicon = document.querySelector("link[rel~='icon']");
  const href = favicon?.getAttribute("href");
  favicon?.setAttribute(
    "href",
    href === whiteFavicon ? redFavicon : whiteFavicon,
  );
};

export type NavWrapperProps = {
  bio: Bio;
  repositories: Repository[];
  /** Show the Archive link (only when the page has an archive). */
  hasArchive?: boolean;
};

export const NavWrapper = ({
  bio,
  repositories,
  hasArchive = false,
}: NavWrapperProps) => {
  const [showBio, setShowBio] = useState(false);
  const [shouldLoadBio, setShouldLoadBio] = useState(false);

  const handleMouseEnter = () => {
    if (!shouldLoadBio) {
      setShouldLoadBio(true);
    }
  };

  const handleClick = () => {
    setShouldLoadBio(true);
    setShowBio(true);
  };

  const handleTheme = () => {
    document.documentElement.classList.toggle("light-theme");
    toggleFavicon();
  };

  return (
    <StyledNavWrapper
      onMouseEnter={handleMouseEnter}
      onFocus={handleMouseEnter}
    >
      <LinkButton href="#main-content">Work</LinkButton>
      {hasArchive && <LinkButton href="#archive">Archive</LinkButton>}
      <Button type="button" onClick={handleClick}>
        About
      </Button>
      <Button type="button" onClick={handleTheme}>
        Theme
      </Button>
      <LinkButton href="design">Design ↗</LinkButton>
      {shouldLoadBio &&
        createPortal(
          <Suspense fallback={null}>
            <LazyBioPortal
              bio={bio}
              repositories={repositories}
              showBio={showBio}
              onClose={() => setShowBio(false)}
            />
          </Suspense>,
          document.body,
        )}
    </StyledNavWrapper>
  );
};
