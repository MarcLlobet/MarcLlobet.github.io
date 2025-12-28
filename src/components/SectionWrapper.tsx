import styled from "styled-components"
import type { Repository } from "../services"
import { Title } from "./Title";

const StyledSectionWrapper = styled.section`
  width: 100%;
  height: 100dvh;
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
    "links";
  grid-template-columns: 34ch;
  grid-template-rows: auto auto auto auto;
  gap: 1.5rem;
  padding-block-start: 3dvh;
  padding-block-end: 3dvh;

  @media (min-width: 940px) {
    grid-template-areas:
      "title title"
      "desc image"
      "links image";
    grid-template-columns: 34ch 1fr;
    grid-template-rows: auto auto auto;
    align-items: start;
    column-gap: 4dvw;
  }
`;

const PreviewImage = styled.img`
  grid-area: image;
  filter: grayscale(1);
  width: 100%;
  height: auto;
  align-self: start;
  @media (min-width: 800px) {
    justify-self: end;
  }
`;
const Description = styled.p`
  grid-area: desc;
  width: 34ch;
  padding-block-end: 3dvh;
`;
const Links = styled.p`
  grid-area: links;
`;


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
        <Links>
          {repository.homepageUrl && (<><span>
              <a href={repository.homepageUrl} target='_blank' rel="noopener noreferrer">
                Demo
              </a>
            </span>&nbsp;</>)
          }
          <span>
            <a href={repository.url} target='_blank' rel="noopener noreferrer">
              Github
            </a>
          </span>
          &nbsp;
          <span>{repository.primaryLanguage?.name}</span>
        </Links>
      </InnerSectionWrapper>
    </StyledSectionWrapper>
  )
}