import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MorphShape } from "./MorphShape";

const meta: Meta<typeof MorphShape> = {
  title: "Components/MorphShape",
  component: MorphShape,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "radio",
      options: ["small", "big"],
    },
    stroke: { control: "color" },
    fill: { control: "color" },
    infiniteAnimation: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof MorphShape>;

export const Small: Story = {
  args: {
    size: "small",
  },
};

export const Big: Story = {
  args: {
    size: "big",
  },
};

export const WithAccentColor: Story = {
  args: {
    size: "big",
    stroke: "var(--color-accent)",
  },
};

export const InfiniteAnimation: Story = {
  args: {
    size: "big",
    stroke: "var(--color-accent)",
    infiniteAnimation: true,
  },
};

export const Filled: Story = {
  args: {
    size: "big",
    fill: "var(--color-accent)",
    stroke: "var(--color-accent)",
  },
};
