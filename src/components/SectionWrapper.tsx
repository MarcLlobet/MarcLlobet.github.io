import styled from "styled-components";
import { Title } from "./Title";
import { useMemo, type ReactNode } from "react";
import { getSentenceList } from "../utils/getSentenceList";
import type { Repository } from "../services";

const StyledSectionWrapper = styled.section`
  block-size: 100dvh;
  inline-size: 100%;
  display: flex;
  align-items: center;
  scroll-snap-align: start;
`;

const InnerSectionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
`;

const PreviewImage = styled.img`
  filter: grayscale(1);
  inline-size: calc(100% - 30ch - 4dvw);
  max-inline-size: 650px;
  object-fit: cover;
  object-position: center;
  padding-block-end: 3dvh;
  mix-blend-mode: plus-lighter;
  order: 1;
  padding-block-end: 0;

  html.light-theme & {
    mix-blend-mode: darken;
  }

  @media (max-width: 900px) {
    order: 0;
    inline-size: 100%;
    padding-block-end: 0;
    max-inline-size: 450px;
  }
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  inline-size: 30ch;

  @media (max-width: 900px) {
    gap: 1rem;
    inline-size: 100%;
    max-inline-size: 32ch;
  }
`;

const Languages = ({
  primaryLanguage,
  languages,
}: {
  primaryLanguage: string;
  languages: { name: string }[];
}) => {
  const technologies = useMemo<ReactNode>(() => {
    const languageNames = languages.map(({ name }) => name);
    const [primary, ...rest] = new Set([primaryLanguage, ...languageNames]);
    const restSentence = getSentenceList(rest);

    return (
      <>
        Done mainly with <b>{primary}</b> along with {restSentence}.
      </>
    );
  }, [primaryLanguage, languages]);

  return (
    <p>
      <span>{technologies}</span>
    </p>
  );
};

export const SectionWrapper = ({ repository }: { repository: Repository }) => {
  return (
    <StyledSectionWrapper
      className="page-section"
      id={repository.name}
      aria-label={repository.name}
    >
      <InnerSectionWrapper>
        <Title title={repository.name} />
        <PreviewImage
          src={repository.preview}
          alt={`Preview of ${repository.name} repository`}
        />
        <TextWrapper>
          <p>{repository.description}</p>
          <Languages
            primaryLanguage={repository.primaryLanguage.name}
            languages={repository.languages}
          />
          <p>
            {repository.homepageUrl && (
              <>
                <span>
                  <a
                    href={repository.homepageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Demo
                  </a>
                </span>
                &nbsp;•&nbsp;
              </>
            )}
            <span>
              <a
                href={repository.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Code
              </a>
            </span>
          </p>
        </TextWrapper>
      </InnerSectionWrapper>
    </StyledSectionWrapper>
  );
};
