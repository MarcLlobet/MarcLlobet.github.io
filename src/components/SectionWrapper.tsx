import styled from "styled-components"
import type { Repository } from "../services"
import { Title } from "./Title";
import { useMemo, type ReactNode } from "react";
import { getSentenceList } from "../utils/getSentenceList";

const StyledSectionWrapper = styled.section`
  block-size: 100dvh;
  inline-size: 100%;
  display: flex;
  align-items: center;
  scroll-snap-align: start;
`

const InnerSectionWrapper = styled.div`
  display: grid;
  grid-template-areas:
    "title"
    "image"
    "desc"
    "languages"
    "links";
  grid-template-columns: 1fr;
  grid-template-rows: auto auto auto auto auto;
  padding-block-start: 3dvh;
  padding-block-end: 3dvh;

  @media (min-width: 800px) {
    grid-template-areas:
      "title title"
      "desc image"
      "languages image"
      "links image";
    grid-template-columns: 26ch 1fr;
    grid-template-rows: auto auto auto;
    align-items: start;
    column-gap: 4dvw;
    row-gap: 0;
  }
`;

const PreviewImage = styled.img`
  grid-area: image;
  filter: grayscale(1);
  inline-size: 100%;
  block-size: auto;
  align-self: start;
  object-fit: cover;
  object-position: center;
  padding-block-end: 3dvh;
  mix-blend-mode: plus-lighter;

  @media (prefers-color-scheme: light) {
    mix-blend-mode: overlay;
  }

  @media (min-width: 800px) {
    justify-self: end;
    padding-block-end: 0;
  }
`;
const Description = styled.p`
  grid-area: desc;
  padding-block-end: 3dvh;
`;

const Links = styled.p`
  grid-area: links;
  
  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
`;

const StyledLanguages = styled.p`
  grid-area: languages;
  padding-block-end: 3dvh;
  & > b {
    font-weight: var(--satoshi-weight-bold);
  }
`;

const Languages = ({ 
  primaryLanguage,
  languages 
}: {
  primaryLanguage: string, 
  languages: {name: string}[]
} ) => {

  const technologies = useMemo<ReactNode>(() => {
    const languageNames = languages.map(({name}) => name);
    const [primary, ...rest] = new Set([primaryLanguage, ...languageNames])
    const restSentence = getSentenceList(rest);
    
    return (
      <>Done mainly with <b>{primary}</b> along with {restSentence}.</>
    )
  }, [languages]);

  return (
    <StyledLanguages>
      <span>{technologies}</span>
    </StyledLanguages>
  )
}


export const SectionWrapper = ({repository}: {repository: Repository}) => {
  return (
    <StyledSectionWrapper 
      className="page-section" 
      id={repository.name}
    >
      <InnerSectionWrapper>
        <Title title={repository.name} />
        <PreviewImage src={repository.preview} alt={`Preview of ${repository.name} repository`} />
        <Description>{repository.description}</Description>
        <Languages 
          primaryLanguage={repository.primaryLanguage.name}
          languages={repository.languages} 
        />
        <Links>
          {repository.homepageUrl && (<><span>
              <a href={repository.homepageUrl} target='_blank' rel="noopener noreferrer">
                Demo
              </a>
            </span>&nbsp;•&nbsp;</>)
          }
          <span>
            <a href={repository.url} target='_blank' rel="noopener noreferrer">
              Code
            </a>
          </span>
        </Links>
      </InnerSectionWrapper>
    </StyledSectionWrapper>
  )
}