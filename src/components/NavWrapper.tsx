import styled from "styled-components";
import { fetchBio } from "../services";
import React, { useState, Suspense } from "react";
import { createPortal } from "react-dom";

export const StyledNavWrapper = styled.nav`
  padding-block: var(--spacing);
  position: sticky;
  top: 0;
  display: flex;
  gap: var(--spacing);
  align-items: center;
  justify-content: flex-end;
  z-index: 1;
  inline-size: 100%;

  @media (orientation: landscape) and (max-height: 400px) {
    margin-block-end: 30px;
  }
`;

const Button = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  line-height: var(--spacing);
  padding: 0;
  appearance: none;
  font-family: inherit;
  cursor: pointer;
  font-weight: 500;

  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
`;

const witheFavicon = "/favicon-white.svg";
const redFavicon = "/favicon-red.svg";

const toggleFavicon = () => {
  const favicon = document.querySelector("link[rel~='icon']");
  const href = favicon?.getAttribute("href");
  favicon?.setAttribute(
    "href",
    href === witheFavicon ? redFavicon : witheFavicon,
  );
};

export const NavWrapper = () => {
  const [showBio, setShowBio] = useState(false);
  const [ComponentWithBio, createComponentWithBio] = useState<
    | null
    | (({
        showBio,
        onClose,
      }: {
        showBio: boolean;
        onClose: () => void;
      }) => React.ReactNode)
  >(null);

  const handleMouseEnter = () => {
    if (!ComponentWithBio) {
      Promise.all([fetchBio(), import("./BioPortal")]).then(
        ([fetchedBio, BioPortalModule]) =>
          createComponentWithBio(
            () =>
              ({
                showBio,
                onClose,
              }: {
                showBio: boolean;
                onClose: () => void;
              }) =>
                createPortal(
                  <BioPortalModule.default
                    bio={fetchedBio}
                    showBio={showBio}
                    onClose={onClose}
                  />,
                  document.body,
                ),
          ),
      );
    }
  };

  const handleClick = () => setShowBio(true);

  const handleTheme = () => {
    document.documentElement.classList.toggle("light-theme");

    toggleFavicon();
  };

  return (
    <StyledNavWrapper onMouseEnter={handleMouseEnter}>
      <Button onClick={handleTheme}>Theme</Button>
      <Button onClick={handleClick}>About</Button>
      {ComponentWithBio && (
        <Suspense fallback={null}>
          <ComponentWithBio
            showBio={showBio}
            onClose={() => setShowBio(false)}
          />
        </Suspense>
      )}
    </StyledNavWrapper>
  );
};
