import styled from "styled-components";
import { fetchBio, type Repository } from "../services";
import { useState, useRef, lazy, Suspense } from "react";
import { createPortal } from "react-dom";

export const StyledNavWrapper = styled.nav`
  block-size: 10dvh;
  inline-size: 100%;
  position: sticky;
  top: 0;
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: flex-end;
  padding-block-end: 2px;
  padding-block-start: 2px;
  padding-inline-end: 10px;
  padding-inline-start: 10px;
`;

const Button = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  padding: 0;
  appearance: none;
  font-family: inherit;
  cursor: pointer;
  font-weight: 500;
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

  return (
    <StyledNavWrapper onMouseEnter={handleMouseEnter}>
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