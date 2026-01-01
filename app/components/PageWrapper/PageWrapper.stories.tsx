import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import styled from "styled-components";

const ScreenWrapper = styled.div`
  opacity: 1;
  display: flex;
  flex-direction: row;
  top: 0;
  inline-size: 100%;
`;

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  inline-size: 100%;
`;

const MainWrapper = styled.main`
  display: flex;
  flex-direction: column;
  inline-size: 100%;
  padding-block-start: 60px;
`;

const Footer = styled.footer`
  padding-block-end: var(--spacing);
  padding-block-start: calc(var(--spacing) / 4);
  position: sticky;
  bottom: 0;
  display: flex;
  gap: var(--spacing);
  align-items: center;
  justify-content: flex-end;
  z-index: 1;
  inline-size: 100%;
`;

const ScrollToTopButton = styled.button<{ $shouldShow: boolean }>`
  background: none;
  border: none;
  font-size: var(--spacing);
  line-height: var(--spacing);
  font-weight: 500;
  transition: opacity 300ms ease-in;
  cursor: pointer;
  pointer-events: ${(props) => (props.$shouldShow ? "auto" : "none")};
  opacity: ${(props) => (props.$shouldShow ? 1 : 0)};
  color: var(--color-muted);
  &:hover {
    color: var(--color-accent);
  }
  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const ContentPlaceholder = styled.div`
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--color-muted);
  color: var(--color-muted);
  margin: var(--spacing);
`;

type PageWrapperUIProps = {
  showScrollTop: boolean;
  onScrollTop: () => void;
  children?: React.ReactNode;
};

const PageWrapperUI = ({
  showScrollTop,
  onScrollTop,
  children,
}: PageWrapperUIProps) => (
  <ScreenWrapper>
    <ColumnWrapper>
      <MainWrapper>
        {children}
        <Footer>
          <ScrollToTopButton
            onClick={onScrollTop}
            $shouldShow={showScrollTop}
            aria-label="Scroll to top"
          >
            <svg
              stroke="currentColor"
              strokeWidth={4}
              fill="none"
              viewBox="0 0 100 100"
            >
              <desc>Scroll to top</desc>
              <path d="M50 2L2 98h98L50 2z" />
            </svg>
          </ScrollToTopButton>
        </Footer>
      </MainWrapper>
    </ColumnWrapper>
  </ScreenWrapper>
);

const meta: Meta<typeof PageWrapperUI> = {
  title: "Layout/PageWrapper",
  component: PageWrapperUI,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    showScrollTop: { control: "boolean" },
    onScrollTop: { action: "scroll to top" },
  },
};

export default meta;
type Story = StoryObj<typeof PageWrapperUI>;

export const WithScrollButton: Story = {
  args: {
    showScrollTop: true,
    children: (
      <>
        <ContentPlaceholder>Section 1</ContentPlaceholder>
        <ContentPlaceholder>Section 2</ContentPlaceholder>
        <ContentPlaceholder>Section 3</ContentPlaceholder>
      </>
    ),
  },
};

export const WithoutScrollButton: Story = {
  args: {
    showScrollTop: false,
    children: (
      <>
        <ContentPlaceholder>Section 1</ContentPlaceholder>
        <ContentPlaceholder>Section 2</ContentPlaceholder>
      </>
    ),
  },
};
