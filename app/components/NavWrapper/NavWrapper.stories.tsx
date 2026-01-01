import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import styled from "styled-components";

const StyledNavWrapper = styled.nav`
  padding-block: var(--spacing);
  position: sticky;
  top: 0;
  display: flex;
  gap: var(--spacing);
  align-items: center;
  justify-content: flex-end;
  z-index: 1;
  inline-size: 100%;
`;

const Button = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  line-height: var(--spacing);
  padding: 0;
  appearance: none;
  font-family: inherit;
  cursor: pointer;
  font-weight: 500;
`;

type NavWrapperUIProps = {
  onThemeClick: () => void;
  onAboutClick: () => void;
};

const NavWrapperUI = ({ onThemeClick, onAboutClick }: NavWrapperUIProps) => (
  <StyledNavWrapper>
    <Button onClick={onThemeClick}>Theme</Button>
    <Button onClick={onAboutClick}>About</Button>
  </StyledNavWrapper>
);

const meta: Meta<typeof NavWrapperUI> = {
  title: "Components/NavWrapper",
  component: NavWrapperUI,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    onThemeClick: { action: "theme clicked" },
    onAboutClick: { action: "about clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof NavWrapperUI>;

export const Default: Story = {
  args: {},
};
