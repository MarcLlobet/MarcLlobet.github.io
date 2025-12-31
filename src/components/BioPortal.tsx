import { useEffect, useMemo } from "react";
import styled from "styled-components";
import { StyledNavWrapper } from "./NavWrapper";
import { getSentenceList } from "../utils/getSentenceList";
import { useStateContext } from "../state";
import { getAllLanguages } from "../utils/getAllLanguages";

const BioPortalWrapper = styled.div<{ $showBio: boolean }>`
  padding-inline-start: 5dvw;
  padding-inline-end: 5dvw;
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
  opacity: ${(props) => (props.$showBio ? 1 : 0)};
  pointer-events: ${(props) => (props.$showBio ? "auto" : "none")};
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

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  padding-block-end: 5dvh;
  font-size: 2rem;
  block-size: calc(100dvh - 66px);

  p {
    max-width: 32ch;

    @media (max-width: 600px) {
      font-size: 1.5rem;
    }
  }

  @media (orientation: landscape) and (max-height: 400px) {
    font-size: 1.5rem;
    padding-block-start: 0;
    justify-content: center;
  }
`;

const StyledAboutNav = styled(StyledNavWrapper)`
  @media (orientation: landscape) and (max-height: 400px) {
    margin-block-end: 0;
  }
`;

const BioPortal = ({
  bio,
  showBio,
  onClose,
}: {
  bio: string;
  showBio: boolean;
  onClose: () => void;
}) => {
  const { repositories } = useStateContext();

  const technologiesSentence = useMemo(() => {
    const allLanguages = getAllLanguages(repositories);
    return getSentenceList(allLanguages);
  }, [repositories]);

  const handleClick = () => {
    onClose();
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (!showBio) {
        return;
      }
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "Tab" || event.key === " ") {
        event.preventDefault();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, showBio]);

  return (
    <BioPortalWrapper $showBio={showBio}>
      <StyledAboutNav>
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
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </CloseButton>
      </StyledAboutNav>
      <TextWrapper>
        <p>{bio}</p>
        <p>
          The list of technologies I used to build my projects, from more used
          to less used, is the following: {technologiesSentence}.
        </p>
      </TextWrapper>
    </BioPortalWrapper>
  );
};

export default BioPortal;
