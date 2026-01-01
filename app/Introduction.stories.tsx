import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: calc(var(--spacing) * 2);
  width: 100%;
`;

const Title = styled.h1`
  font-size: calc(1rem * var(--golden-ratio) * 2);
  margin-bottom: var(--spacing);
  color: var(--color-heading);
`;

const Description = styled.p`
  color: var(--color-text);
  margin-bottom: var(--spacing);
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

const NavItem = styled.li`
  margin-bottom: var(--spacing);
`;

const NavLink = styled.a`
  color: var(--color-accent);
  text-decoration: none;
  font-size: 1.1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Section = styled.section`
  margin-top: calc(var(--spacing) * 2);
`;

const SectionTitle = styled.h2`
  font-size: calc(1rem * var(--golden-ratio));
  color: var(--color-heading);
  margin-bottom: var(--spacing);
  padding-block: 1.5rem 1rem;
  line-height: 1rem;
`;

const Introduction = () => (
  <Wrapper>
    <Section>
      <NavList>
        <NavItem>
          <NavLink href="/">Home</NavLink> — Main portfolio page
        </NavItem>
        <NavItem>
          <NavLink href="/design">Design</NavLink> — Visual design guide
        </NavItem>
      </NavList>
    </Section>

    <Title>Marc Llobet&apos;s Portfolio</Title>
    <Description>
      Technical documentation for the UI components used in this portfolio.
    </Description>

    <Section>
      <SectionTitle>About this Storybook</SectionTitle>
      <Description>
        Explore the sidebar to browse all available components.
      </Description>
      <Description>
        Each component includes live preview, interactive controls, and
        accessibility checks.
      </Description>
    </Section>
  </Wrapper>
);

const meta: Meta<typeof Introduction> = {
  title: "Introduction",
  component: Introduction,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Introduction>;

export const Welcome: Story = {};
