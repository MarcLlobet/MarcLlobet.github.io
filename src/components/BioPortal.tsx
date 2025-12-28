import { forwardRef, useEffect } from "react";
import styled from "styled-components";
import { StyledNavWrapper } from "./NavWrapper";

const BioPortalWrapper = styled.div<{ $showBio: boolean }>`
  padding-inline-start: 10dvw;
  padding-inline-end: 10dvw;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-bg);
  color: var(--color-accent);
  width: 100dvw;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
  opacity: ${props => props.$showBio ? 1 : 0};
  pointer-events: ${props => props.$showBio ? 'auto' : 'none'};
  transition: opacity 150ms ease-in-out;
`;

const CloseButton = styled.button<{ $showBio: boolean }>`
  display: flex;
  align-items: flex-end;
  background: none;
  border: none;
  cursor: pointer;
  appearance: none;
  color: var(--color-accent);
`;

const BigParagraph = styled.div`
  font-size: 3rem;
  line-height: 3.5rem;
  font-weight: 900;
  width: 20ch;
  flex-grow: 1;
  display: flex;
  align-items: center;
  padding-block-end: 10dvh;
`;

const BioPortal = forwardRef<HTMLDivElement, { bio: string | null, showBio: boolean, onClose: () => void }>(
  ({ bio, showBio, onClose }, ref) => {
  const handleClick = () => {
    onClose();
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if(!showBio) {
        return;
      }
      if (event.key === 'Escape') {
        onClose();
      } else if(event.key === 'Tab' || event.key === ' ') {
        event.preventDefault();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose, showBio]);


  return (
    <BioPortalWrapper $showBio={showBio} ref={ref}>
      <StyledNavWrapper>
        <CloseButton 
          onClick={handleClick} 
          aria-label="Close"
          $showBio={showBio}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </CloseButton>
      </StyledNavWrapper>
      <BigParagraph>
        <p>{bio}</p>
      </BigParagraph>
    </BioPortalWrapper>
  );
});

export default BioPortal;