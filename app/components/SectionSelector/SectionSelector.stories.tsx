import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SectionSelector } from "./SectionSelector";

const meta: Meta<typeof SectionSelector> = {
  title: "Components/SectionSelector",
  component: SectionSelector,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SectionSelector>;

export const Default: Story = {
  args: {
    repository: { id: "1", name: "example-repo" },
    currentSection: null,
  },
};

export const Selected: Story = {
  args: {
    repository: { id: "1", name: "example-repo" },
    currentSection: "example-repo",
  },
};
