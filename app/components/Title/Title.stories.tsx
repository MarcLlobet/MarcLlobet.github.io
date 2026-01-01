import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Title } from "./Title";

const meta: Meta<typeof Title> = {
  title: "Components/Title",
  component: Title,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Title>;

export const Default: Story = {
  args: {
    title: "fluency-report",
  },
};

export const WordleApp: Story = {
  args: {
    title: "wordle-app",
  },
};

export const SemanticGit: Story = {
  args: {
    title: "semantic-git",
  },
};

export const LongTitle: Story = {
  args: {
    title: "my-awesome-project-name",
  },
};
