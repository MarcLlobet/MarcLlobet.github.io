"use client";

import { useEffect, useMemo, useRef } from "react";
import { getSentenceList } from "../../utils/getSentenceList";
import { getAllLanguages } from "../../utils/getAllLanguages";
import { useFocusTrap } from "../../utils/useFocusTrap";
import {
  BioPortalWrapper,
  CloseButton,
  TextWrapper,
  StyledAboutNav,
} from "./BioPortal.styles";
import type { Repository } from "../../types";

export type BioPortalProps = {
  bio: string;
  repositories: Repository[];
  showBio: boolean;
  onClose: () => void;
};

export const BioPortal = ({
  bio,
  repositories,
  showBio,
  onClose,
}: BioPortalProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const technologiesSentence = useMemo(() => {
    const allLanguages = getAllLanguages(repositories);
    return getSentenceList(allLanguages);
  }, [repositories]);

  const handleClick = () => {
    onClose();
  };

  useFocusTrap(wrapperRef, onClose, showBio);

  // Set focus when modal opens, restore when it closes
  useEffect(() => {
    if (showBio) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      closeButtonRef.current?.focus();
    } else if (previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  }, [showBio]);

  return (
    <BioPortalWrapper
      $showBio={showBio}
      ref={wrapperRef}
      role="dialog"
      aria-modal="true"
      aria-label="About me"
    >
      <StyledAboutNav>
        <CloseButton
          type="button"
          ref={closeButtonRef}
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
