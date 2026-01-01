import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import styled from "styled-components";
import { SectionSelector } from "../SectionSelector";

const SectionsSelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--spacing);
  min-inline-size: 20px;
  padding: var(--spacing);
`;

const HorizontalWrapper = styled(SectionsSelectorWrapper)`
  flex-direction: row;
`;

type Repository = {
  id: string;
  name: string;
};

type SectionsSelectorUIProps = {
  repositories: Repository[];
  currentSection: string | null;
  horizontal?: boolean;
};

const SectionsSelectorUI = ({
  repositories,
  currentSection,
  horizontal = false,
}: SectionsSelectorUIProps) => {
  const Wrapper = horizontal ? HorizontalWrapper : SectionsSelectorWrapper;

  return (
    <Wrapper role="menu">
      {repositories.map((repository) => (
        <SectionSelector
          key={repository.id}
          repository={repository}
          currentSection={currentSection}
        />
      ))}
    </Wrapper>
  );
};

const mockRepositories: Repository[] = [
  { id: "1", name: "fluency-report" },
  { id: "2", name: "wordle-app" },
  { id: "3", name: "semantic-git" },
  { id: "4", name: "portfolio" },
  { id: "5", name: "cli-tools" },
];

const meta: Meta<typeof SectionsSelectorUI> = {
  title: "Components/SectionsSelector",
  component: SectionsSelectorUI,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    currentSection: {
      control: "select",
      options: [null, ...mockRepositories.map((r) => r.name)],
    },
    horizontal: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof SectionsSelectorUI>;

export const NoSelection: Story = {
  args: {
    repositories: mockRepositories,
    currentSection: null,
  },
};

export const FirstSelected: Story = {
  args: {
    repositories: mockRepositories,
    currentSection: "fluency-report",
  },
};

export const MiddleSelected: Story = {
  args: {
    repositories: mockRepositories,
    currentSection: "semantic-git",
  },
};

export const Horizontal: Story = {
  args: {
    repositories: mockRepositories,
    currentSection: "wordle-app",
    horizontal: true,
  },
};
