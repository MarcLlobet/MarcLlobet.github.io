"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusTrap } from "../../utils/useFocusTrap";
import { setTransitionOrigin, revealDelay } from "../../utils/pageTransition";
import { useMediaQuery } from "../../utils/useMediaQuery";
import { AboutContent } from "../AboutContent";
import {
  BioPortalWrapper,
  CloseButton,
  StyledAboutNav,
  NavLabel,
  CloseGroup,
  EscHint,
} from "./BioPortal.styles";
import type { Repository } from "../../types";

export type BioPortalProps = {
  bio: string;
  repositories: Repository[];
  githubUrl: string;
  /** Called once the collapse animation has finished — navigate away here. */
  onClose: () => void;
};

/**
 * The About screen: a circle reveals it on mount and collapses it before
 * `onClose` fires, so it works equally as a routed page (reveals from a
 * neutral corner) or an intercepted modal (reveals from whichever link was
 * clicked, via setTransitionOrigin called by the caller beforehand).
 */
export const BioPortal = ({
  bio,
  repositories,
  githubUrl,
  onClose,
}: BioPortalProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [revealed, setRevealed] = useState(false);
  /* A fine pointer is the closest signal CSS has for "probably has a keyboard" —
     showing an Escape hint on a touch-only device would just be misleading. */
  const hasKeyboard = useMediaQuery("(pointer: fine)");

  useEffect(() => {
    closeButtonRef.current?.focus();
    const frame = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const close = useCallback(() => {
    setTransitionOrigin(closeButtonRef.current);
    setRevealed(false);
    window.setTimeout(onClose, revealDelay());
  }, [onClose]);

  useFocusTrap(wrapperRef, close);

  return (
    <BioPortalWrapper
      $revealed={revealed}
      ref={wrapperRef}
      role="dialog"
      aria-modal="true"
      aria-label="About"
    >
      <StyledAboutNav>
        <NavLabel>About</NavLabel>
        <CloseGroup>
          {hasKeyboard && <EscHint>ESC</EscHint>}
          <CloseButton type="button" ref={closeButtonRef} onClick={close}>
            Close
          </CloseButton>
        </CloseGroup>
      </StyledAboutNav>
      <AboutContent
        bio={bio}
        repositories={repositories}
        githubUrl={githubUrl}
      />
    </BioPortalWrapper>
  );
};
