"use client";

import { useMemo, type ReactNode } from "react";
import { Title } from "../Title";
import { getSentenceList } from "../../utils/getSentenceList";
import {
  StyledSectionWrapper,
  InnerSectionWrapper,
  PreviewImage,
  TextWrapper,
} from "./SectionWrapper.styles";
import type { Repository } from "../../types";

export type SectionWrapperProps = {
  repository: Repository;
};

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

export const SectionWrapper = ({ repository }: SectionWrapperProps) => {
  const titleId = `title-${repository.name}`;

  return (
    <StyledSectionWrapper
      className="page-section"
      id={repository.name}
      aria-labelledby={titleId}
    >
      <InnerSectionWrapper>
        <Title title={repository.name} id={titleId} />
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
