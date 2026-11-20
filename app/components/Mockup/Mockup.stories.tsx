import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { CSSProperties } from "react";
import { Mockup } from "./Mockup";
import { MOCKUP_KINDS } from "../../mockups";
import { accentFor } from "../../utils/projects";

const meta: Meta<typeof Mockup> = {
  title: "Components/Mockup",
  component: Mockup,
  argTypes: {
    kind: { control: "select", options: MOCKUP_KINDS },
  },
  decorators: [
    (Story) => (
      <div
        data-play="hover"
        style={
          {
            "--c": accentFor(0),
            position: "relative",
            inlineSize: "min(100%, 720px)",
            aspectRatio: "2 / 1",
          } as CSSProperties
        }
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Mockup>;

export const MapView: Story = { args: { kind: "map" } };
export const Store: Story = { args: { kind: "store" } };
export const Matrix: Story = { args: { kind: "matrix" } };
export const Terminal: Story = { args: { kind: "terminal" } };
export const Tiles: Story = { args: { kind: "tiles" } };
export const Graph: Story = { args: { kind: "graph" } };
