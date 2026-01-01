import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import styled from "styled-components";
import { Title } from "../Title";

const StyledSectionWrapper = styled.section`
  block-size: auto;
  min-height: 400px;
  inline-size: 100%;
  display: flex;
  align-items: center;
  padding: var(--spacing);
`;

const InnerSectionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
`;

const PreviewImage = styled.img`
  filter: grayscale(1);
  inline-size: calc(100% - 30ch - 4dvw);
  max-inline-size: 650px;
  object-fit: cover;
  object-position: center;
  mix-blend-mode: plus-lighter;
  order: 1;

  html.light-theme & {
    mix-blend-mode: darken;
  }

  @media (max-width: 900px) {
    order: 0;
    inline-size: 100%;
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

type SectionWrapperUIProps = {
  name: string;
  description: string;
  primaryLanguage: string;
  languages: string[];
  preview?: string;
  homepageUrl?: string;
  url: string;
};

const SectionWrapperUI = ({
  name,
  description,
  primaryLanguage,
  languages,
  preview,
  homepageUrl,
  url,
}: SectionWrapperUIProps) => {
  const [primary, ...rest] = [primaryLanguage, ...languages];
  const restSentence = rest.join(", ");

  return (
    <StyledSectionWrapper id={name} aria-label={name}>
      <InnerSectionWrapper>
        <Title title={name} />
        {preview && (
          <PreviewImage src={preview} alt={`Preview of ${name} repository`} />
        )}
        <TextWrapper>
          <p>{description}</p>
          <p>
            Done mainly with <b>{primary}</b> along with {restSentence}.
          </p>
          <p>
            {homepageUrl && (
              <>
                <a href={homepageUrl} target="_blank" rel="noopener noreferrer">
                  Demo
                </a>
                &nbsp;•&nbsp;
              </>
            )}
            <a href={url} target="_blank" rel="noopener noreferrer">
              Code
            </a>
          </p>
        </TextWrapper>
      </InnerSectionWrapper>
    </StyledSectionWrapper>
  );
};

const meta: Meta<typeof SectionWrapperUI> = {
  title: "Layout/SectionWrapper",
  component: SectionWrapperUI,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    description: { control: "text" },
    primaryLanguage: { control: "text" },
    languages: { control: "object" },
    preview: { control: "text" },
    homepageUrl: { control: "text" },
    url: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof SectionWrapperUI>;

export const WithDemo: Story = {
  args: {
    name: "fluency-report",
    description:
      "A comprehensive tool for tracking and analyzing language learning progress with detailed reports and visualizations.",
    primaryLanguage: "TypeScript",
    languages: ["React", "Node.js", "PostgreSQL"],
    homepageUrl: "https://fluency-report.example.com",
    url: "https://github.com/example/fluency-report",
  },
};

export const WithoutDemo: Story = {
  args: {
    name: "semantic-git",
    description:
      "CLI tool for generating semantic commit messages based on staged changes.",
    primaryLanguage: "Python",
    languages: ["Click", "OpenAI API"],
    url: "https://github.com/example/semantic-git",
  },
};

export const WithPreview: Story = {
  args: {
    name: "wordle-app",
    description: "A beautiful Wordle clone with multiple language support.",
    primaryLanguage: "JavaScript",
    languages: ["React", "CSS"],
    preview: "https://via.placeholder.com/600x400/141518/B0483A?text=Preview",
    homepageUrl: "https://wordle.example.com",
    url: "https://github.com/example/wordle-app",
  },
};
