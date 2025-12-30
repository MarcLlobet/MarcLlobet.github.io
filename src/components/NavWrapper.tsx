import styled from "styled-components";
import { fetchBio, type Repository } from "../services";
import { useState, useRef, lazy, Suspense } from "react";
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

const BioPortal = lazy(() => import("./BioPortal"));

export const NavWrapper = ({ repositories }: { repositories: Repository[] }) => {
  const [bio, setBio] = useState<string | null>(null);
  const [showBio, setShowBio] = useState<boolean>(false);
  const portalRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!bio) {
      fetchBio().then((bio) => {
        setBio(bio);
      });
    }
  };

  const handleClick = () => {
    setShowBio(true);
  };

  const handleTheme = () => {
    document.documentElement.classList.toggle('light-theme');
  };

  return (
    <StyledNavWrapper onMouseEnter={handleMouseEnter}>
      <Button onClick={handleTheme}>Theme</Button>
      <Button onClick={handleClick}>About</Button>
      {createPortal(
          <Suspense fallback={null}>
            <BioPortal
              ref={portalRef}
              bio={bio}
              showBio={showBio}
              onClose={() => setShowBio(false)}
              repositories={repositories} 
            />
          </Suspense>,
          document.body
        )
      }
    </StyledNavWrapper>
  );
};