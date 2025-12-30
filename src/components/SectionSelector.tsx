import { useEffect, useMemo, useRef } from "react";
import { MorphShape } from "./MorphShape";
import styled from "styled-components";

const StyledSectionSelector = styled.a<{ $isSelected: boolean }>`
  display: inline-flex;

  color: ${(props) =>
    props.$isSelected ? "var(--color-accent)" : "var(--color-muted)"};

  transition: color 150ms ease-in-out;

  svg {
    color: currentColor;
  }
`;

export const SectionSelector = ({
  repository,
  currentSection,
}: {
  repository: { id: string; name: string };
  currentSection: string | null;
}) => {
  const morphRef = useRef<{
    morph: () => void;
    reset: () => void;
  }>(null);

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute("href")?.substring(1);
    if (targetId) {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: "smooth",
        });
      }
    }
  };

  const isSelected = useMemo(
    () => repository.name === currentSection,
    [repository.name, currentSection],
  );

  useEffect(() => {
    if (isSelected) {
      morphRef.current?.morph();
    } else {
      morphRef.current?.reset();
    }
  }, [isSelected]);

  useEffect(() => {
    const currentHash = window.location.hash.slice(1);

    if (!!currentSection && currentHash !== currentSection) {
      history.replaceState(history.state, "", `#${currentSection}`);
    } else if (!currentSection && currentHash.length) {
      const urlWithNoHash = window.location.origin + window.location.pathname;
      history.replaceState(history.state, "", urlWithNoHash);
    }
  }, [currentSection]);

  return (
    <StyledSectionSelector
      href={`#${repository.name}`}
      onClick={handleClick}
      role="menuitemradio"
      aria-label={repository.name}
      aria-checked={isSelected}
      $isSelected={isSelected}
    >
      <MorphShape ref={morphRef} size="small" />
    </StyledSectionSelector>
  );
};
