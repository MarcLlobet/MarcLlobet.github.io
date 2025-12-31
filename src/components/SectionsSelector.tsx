import styled from "styled-components";
import { useCurrentSection } from "../utils/useCurrentSection";
import { SectionSelector } from "./SectionSelector";
import { useStateContext } from "../state";

const SectionsSelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--spacing);
  min-inline-size: 20px;

  @media (max-width: 600px) {
    min-inline-size: 30px;
  }

  @media (orientation: landscape) and (max-height: 400px) {
    flex-direction: row;
  }
`;

export const SectionsSelector = () => {
  const { repositories } = useStateContext();
  const currentSection = useCurrentSection(repositories);

  return (
    <SectionsSelectorWrapper role="menu">
      {repositories.map((repository) => (
        <SectionSelector
          key={repository.id}
          repository={repository}
          currentSection={currentSection}
        />
      ))}
    </SectionsSelectorWrapper>
  );
};
