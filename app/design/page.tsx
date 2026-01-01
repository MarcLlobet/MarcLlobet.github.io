"use client";

import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { MorphShape } from "../components/MorphShape";
import { Title } from "../components/Title";
import { FirstNameWrapper, SurnameWrapper, NameWrapper } from "../App.styles";

const BackButton = styled.a`
  position: fixed;
  top: calc(var(--spacing) * 1.5);
  left: calc(var(--spacing) * 1.5);
  background: none;
  border: none;
  cursor: pointer;
  z-index: 100;
  transition: transform 0.2s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    transform: rotate(-90deg);
  }

  &:hover {
    transform: scale(1.1);
  }
`;

const ThemeToggle = styled.button<{ $isLight: boolean }>`
  position: fixed;
  top: calc(var(--spacing) * 1.5);
  right: calc(var(--spacing) * 1.5);
  background: var(--color-text);
  color: var(--color-bg);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
    color: var(--color-bg);
  }
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(var(--spacing) * 4);
  padding: calc(var(--spacing) * 2);
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  border-bottom: 1px solid var(--color-muted);
  padding-bottom: calc(var(--spacing) * 2);
`;

const PageTitle = styled.h1`
  font-size: calc(1rem * var(--golden-ratio) * 2);
  margin-bottom: var(--spacing);
`;

const PageDescription = styled.p`
  color: var(--color-muted);
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--spacing);
`;

const SectionTitle = styled.h2`
  font-size: calc(1rem * var(--golden-ratio) * 1.5);
  padding: 0;
  border-bottom: 1px solid var(--color-muted);
  padding-bottom: calc(var(--spacing) / 2);
`;

const ComponentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: calc(var(--spacing) * 2);
`;

const ComponentCard = styled.div`
  background: color-mix(in srgb, var(--color-bg) 90%, var(--color-text) 10%);
  border-radius: 8px;
  padding: calc(var(--spacing) * 1.5);
  display: flex;
  flex-direction: column;
  gap: var(--spacing);
`;

const ComponentName = styled.h3`
  font-size: 1rem;
  color: var(--color-heading);
  font-family: var(--satoshi-stack);
  font-weight: 600;
`;

const ComponentDescription = styled.p`
  font-size: 0.875rem;
  color: var(--color-muted);
`;

const ComponentPreview = styled.div`
  background: var(--color-bg);
  border-radius: 4px;
  padding: var(--spacing);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
`;

const Label = styled.span`
  font-size: 0.75rem;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const InteractiveButton = styled.button`
  background: var(--color-accent);
  color: white;
  border: none;
  padding: calc(var(--spacing) / 2) var(--spacing);
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.875rem;
  transition: background-color 100ms ease-in-out;

  &:hover {
    opacity: 0.9;
    color: white;
    background-color: #6d332bff;
  }
`;

const ColorSwatch = styled.div<{ $color: string }>`
  width: 120px;
  height: 120px;
  border-radius: 8px;
  background: var(${(props) => props.$color});
  ${({ $color }) =>
    $color === "--color-bg"
      ? `
    border: 2px solid var(--color-text);
  `
      : ""}
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 4px;
`;

const ColorsGrid = styled.div`
  display: flex;
  gap: var(--spacing);
  flex-wrap: wrap;
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: calc(var(--spacing) * 2);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const PreviewCard = styled.div`
  background: color-mix(in srgb, var(--color-bg) 90%, var(--color-text) 10%);
  border-radius: 8px;
  padding: calc(var(--spacing) * 1.5);
  display: flex;
  flex-direction: column;
  gap: var(--spacing);
`;

const PreviewLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PreviewTitle = styled.h3`
  font-size: 1rem;
  color: var(--color-heading);
  font-family: var(--satoshi-stack);
  font-weight: 600;
`;

const PreviewDimensions = styled.span`
  font-size: 0.75rem;
  color: var(--color-muted);
  font-family: monospace;
`;

const DeviceFrame = styled.div<{
  $width: number;
  $height: number;
  $maxHeight?: string;
}>`
  width: 100%;
  aspect-ratio: ${(props) => props.$width / props.$height};
  ${(props) => props.$maxHeight && `max-height: ${props.$maxHeight};`}
  background: var(--color-bg);
  border: 2px solid var(--color-muted);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

const LayoutRowGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: calc(var(--spacing) * 2);

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

// Simulated layout previews
const LayoutPreview = styled.div<{ $direction: "row" | "column" }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: ${(props) => props.$direction};
  padding: 8px;
  gap: 8px;
`;

const PreviewAside = styled.div<{ $isTop?: boolean }>`
  background: color-mix(in srgb, var(--color-muted) 20%, transparent);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  ${(props) =>
    props.$isTop
      ? `
    width: 100%;
    height: 28px;
    flex-shrink: 0;
    flex-direction: row;
  `
      : `
    width: 28px;
    height: 100%;
    flex-shrink: 0;
    flex-direction: column;
  `}
`;

const PreviewMain = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const PreviewHero = styled.div<{ $fontSize: number }>`
  display: flex;
  flex-direction: column;
  font-family: var(--stardom-stack);
  color: var(--color-heading);
  font-size: ${(props) => props.$fontSize}px;
  line-height: 1;
  text-align: center;
`;

const PreviewAccent = styled.span`
  color: var(--color-accent);
`;

const PreviewShape = styled.div<{ $animated?: boolean; $size: number }>`
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  border: 2px solid var(--color-accent);
  border-radius: 50%;
  ${(props) =>
    props.$animated &&
    `
    animation: spin 3s linear infinite;
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `}
`;

const PreviewNav = styled.div`
  width: 100%;
  height: 16px;
  background: color-mix(in srgb, var(--color-muted) 15%, transparent);
  border-radius: 2px;
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  width: calc(100% - 16px);
`;

const MiniCircle = styled.div<{ $size?: number }>`
  width: ${(props) => props.$size || 8}px;
  height: ${(props) => props.$size || 8}px;
  border: 1.5px solid var(--color-muted);
  border-radius: 50%;
`;

const MiniTriangle = styled.div<{ $size?: number }>`
  width: 0;
  height: 0;
  border-left: ${(props) => (props.$size || 8) / 2}px solid transparent;
  border-right: ${(props) => (props.$size || 8) / 2}px solid transparent;
  border-bottom: ${(props) => props.$size || 8}px solid var(--color-accent);
`;

// Section preview components
const SectionPreviewWrapper = styled.div<{
  $direction: "row" | "column";
  $centerVertical?: boolean;
}>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: ${(props) => props.$direction};
  padding: 12px;
  gap: 8px;
  align-items: ${(props) =>
    props.$direction === "row"
      ? "center"
      : props.$centerVertical
        ? "center"
        : "flex-start"};
  justify-content: ${(props) =>
    props.$direction === "row"
      ? "space-between"
      : props.$centerVertical
        ? "center"
        : "flex-start"};
  flex-wrap: wrap;
`;

const SectionPreviewTitle = styled.div<{ $fontSize: number }>`
  font-family: var(--stardom-stack);
  color: var(--color-heading);
  font-size: ${(props) => props.$fontSize}px;
  width: 100%;
`;

const SectionImage = styled.div<{ $width: string; $order: number }>`
  background: linear-gradient(
    135deg,
    var(--color-muted) 0%,
    color-mix(in srgb, var(--color-muted) 50%, transparent) 100%
  );
  border-radius: 4px;
  width: ${(props) => props.$width};
  aspect-ratio: 16/10;
  order: ${(props) => props.$order};
  flex-shrink: 0;
`;

const SectionText = styled.div<{ $width: string; $gap: number }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.$gap}px;
  width: ${(props) => props.$width};
`;

const TextLine = styled.div<{ $width: string }>`
  height: 6px;
  background: var(--color-text);
  border-radius: 2px;
  width: ${(props) => props.$width};
  opacity: 0.6;
`;

const TextLineAccent = styled(TextLine)`
  background: var(--color-accent);
  opacity: 1;
`;

const SectionLinks = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;
`;

const LinkPlaceholder = styled.div`
  height: 6px;
  width: 24px;
  background: var(--color-muted);
  border-radius: 2px;
`;

const PreviewDescription = styled.p`
  font-size: 0.8rem;
  color: var(--color-muted);
  margin: 0;
`;

export default function DesignPage() {
  const morphRef = useRef<{
    morph: () => void;
    reset: () => void;
  }>(null);
  const isMorph = useRef<boolean>(true);
  const [isLightTheme, setIsLightTheme] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("light-theme", isLightTheme);
    return () => {
      document.documentElement.classList.remove("light-theme");
    };
  }, [isLightTheme]);

  return (
    <PageWrapper>
      <BackButton href="/" aria-label="Go back to main page">
        <svg
          stroke="var(--color-accent)"
          strokeWidth={4}
          fill="none"
          viewBox="0 0 100 100"
        >
          <desc>Go to main page</desc>
          <path d="M50 2L2 98h98L50 2z" />
        </svg>
      </BackButton>
      <ThemeToggle
        $isLight={isLightTheme}
        onClick={() => setIsLightTheme((prev) => !prev)}
        aria-label={
          isLightTheme ? "Switch to dark mode" : "Switch to light mode"
        }
        title={isLightTheme ? "Dark mode" : "Light mode"}
      >
        {isLightTheme ? "◐" : "◑"}
      </ThemeToggle>
      <Header>
        <PageTitle>Design</PageTitle>
        <PageDescription>
          Visual language and design foundations used in this portfolio. For
          technical component documentation, see the{" "}
          <a href="/storybook" style={{ color: "var(--color-accent)" }}>
            Storybook
          </a>
          .
        </PageDescription>
      </Header>

      {/* Colors */}
      <Section>
        <SectionTitle>Colors</SectionTitle>
        <ColorsGrid>
          <ColorSwatch $color="--color-bg" />

          <ColorSwatch $color="--color-text" />
          <ColorSwatch $color="--color-heading" />
          <ColorSwatch $color="--color-muted" />
          <ColorSwatch $color="--color-accent" />
        </ColorsGrid>
      </Section>

      {/* Typography */}
      <Section>
        <SectionTitle>Typography</SectionTitle>
        <ComponentCard>
          <ComponentName>Hero Name</ComponentName>
          <ComponentDescription>
            Font weight animation for the main name. Font family: Satoshi.
          </ComponentDescription>
          <ComponentPreview
            style={{
              justifyContent: "flex-start",
              padding: "calc(var(--spacing) * 2)",
            }}
          >
            <NameWrapper style={{ fontSize: "3.5rem", lineHeight: "3.5rem" }}>
              <FirstNameWrapper>Marc</FirstNameWrapper>
              <SurnameWrapper>
                Ll<span style={{ color: "var(--color-accent)" }}>o</span>bet
              </SurnameWrapper>
            </NameWrapper>
          </ComponentPreview>
        </ComponentCard>

        <ComponentCard>
          <ComponentName>Title</ComponentName>
          <ComponentDescription>
            Section title with highlighted letter in accent color. Font family:
            Stardom.
          </ComponentDescription>
          <ComponentPreview
            style={{
              flexDirection: "row",
              gap: "2rem",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              padding: "calc(var(--spacing) * 2)",
            }}
          >
            <Title title="fluency-report" />
            <Title title="wordle-app" />
            <Title title="semantic-git" />
          </ComponentPreview>
        </ComponentCard>

        <ComponentCard>
          <ComponentName>Body Text</ComponentName>
          <ComponentDescription>
            Paragraph text. Font family: Satoshi.
          </ComponentDescription>
          <ComponentPreview
            style={{
              flexDirection: "column",
              gap: "1rem",
              alignItems: "flex-start",
              padding: "calc(var(--spacing) * 2)",
            }}
          >
            <p style={{ margin: 0 }}>
              Done mainly with <b>TypeScript</b> along with React, Styled
              Components and Vitest.
            </p>
            <p style={{ margin: 0, color: "var(--color-muted)" }}>
              <a href="#" style={{ color: "var(--color-muted)" }}>
                Demo
              </a>{" "}
              •{" "}
              <a href="#" style={{ color: "var(--color-muted)" }}>
                Code
              </a>
            </p>
          </ComponentPreview>
        </ComponentCard>
      </Section>

      {/* Shapes */}
      <Section>
        <SectionTitle>Shapes</SectionTitle>
        <ComponentGrid>
          <ComponentCard>
            <ComponentName>Infinite animation</ComponentName>
            <ComponentDescription>
              MorphShape with continuous animation between circle and triangle.
            </ComponentDescription>
            <ComponentPreview>
              <MorphShape
                size="big"
                infiniteAnimation
                stroke="var(--color-accent)"
              />
            </ComponentPreview>
          </ComponentCard>

          <ComponentCard>
            <ComponentName>Triggered animation</ComponentName>
            <ComponentDescription>
              MorphShape that animates when the button is pressed.
            </ComponentDescription>
            <ComponentPreview>
              <MorphShape
                ref={morphRef}
                size="big"
                stroke="var(--color-accent)"
              />
            </ComponentPreview>
            <InteractiveButton
              onClick={() => {
                if (isMorph.current) {
                  morphRef?.current?.reset?.();
                } else {
                  morphRef?.current?.morph?.();
                }
                isMorph.current = !isMorph.current;
              }}
            >
              Animate
            </InteractiveButton>
          </ComponentCard>
        </ComponentGrid>
      </Section>

      {/* Spacing Scale */}
      <Section>
        <SectionTitle>Spacing Scale</SectionTitle>
        <ComponentCard>
          <ComponentName>Golden Ratio</ComponentName>
          <ComponentDescription>
            Spacing scale based on the golden ratio (1.618).
          </ComponentDescription>
          <ComponentPreview
            style={{
              flexDirection: "column",
              gap: "0.5rem",
              alignItems: "flex-start",
            }}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <Label style={{ width: "80px" }}>×{n}</Label>
                <div
                  style={{
                    height: "20px",
                    width: `calc(1rem * var(--golden-ratio) * ${n})`,
                    background: "var(--color-accent)",
                    borderRadius: "2px",
                  }}
                />
              </div>
            ))}
          </ComponentPreview>
        </ComponentCard>
      </Section>

      {/* Layout Features */}
      <Section>
        <SectionTitle>Layout Features</SectionTitle>
        <LayoutRowGrid>
          {/* Desktop */}
          <PreviewCard>
            <PreviewLabel>
              <PreviewTitle>Desktop</PreviewTitle>
              <PreviewDimensions>20px base</PreviewDimensions>
            </PreviewLabel>
            <DeviceFrame $width={1440} $height={900}>
              <PreviewNav />
              <LayoutPreview $direction="row">
                <PreviewAside>
                  <MiniCircle />
                  <MiniTriangle />
                  <MiniCircle />
                  <MiniCircle />
                  <MiniCircle />
                </PreviewAside>
                <PreviewMain>
                  <PreviewHero $fontSize={24}>
                    <span>Marc</span>
                    <span>
                      Ll<PreviewAccent>o</PreviewAccent>bet
                    </span>
                  </PreviewHero>
                  <PreviewShape $animated $size={40} />
                </PreviewMain>
              </LayoutPreview>
            </DeviceFrame>
            <PreviewDescription>
              <b>flex-direction: row</b>. Lateral aside.
            </PreviewDescription>
          </PreviewCard>

          {/* Mobile */}
          <PreviewCard>
            <PreviewLabel>
              <PreviewTitle>Mobile</PreviewTitle>
              <PreviewDimensions>16px base</PreviewDimensions>
            </PreviewLabel>
            <DeviceFrame $width={375} $height={667} $maxHeight="180px">
              <PreviewNav />
              <LayoutPreview $direction="row">
                <PreviewAside>
                  <MiniCircle $size={6} />
                  <MiniTriangle $size={6} />
                  <MiniCircle $size={6} />
                  <MiniCircle $size={6} />
                  <MiniCircle $size={6} />
                </PreviewAside>
                <PreviewMain>
                  <PreviewHero $fontSize={16}>
                    <span>Marc</span>
                    <span>
                      Ll<PreviewAccent>o</PreviewAccent>bet
                    </span>
                  </PreviewHero>
                  <PreviewShape $animated $size={28} />
                </PreviewMain>
              </LayoutPreview>
            </DeviceFrame>
            <PreviewDescription>
              Smaller title (4.05rem ≈ 65px).
            </PreviewDescription>
          </PreviewCard>

          {/* Landscape */}
          <PreviewCard>
            <PreviewLabel>
              <PreviewTitle>Landscape</PreviewTitle>
              <PreviewDimensions>14px base</PreviewDimensions>
            </PreviewLabel>
            <DeviceFrame $width={844} $height={390}>
              <LayoutPreview $direction="column">
                <PreviewAside $isTop>
                  <MiniCircle $size={6} />
                  <MiniTriangle $size={6} />
                  <MiniCircle $size={6} />
                  <MiniCircle $size={6} />
                  <MiniCircle $size={6} />
                </PreviewAside>
                <PreviewMain>
                  <PreviewHero $fontSize={14}>
                    <span>Marc</span>
                    <span>
                      Ll<PreviewAccent>o</PreviewAccent>bet
                    </span>
                  </PreviewHero>
                  <PreviewShape $animated $size={24} />
                </PreviewMain>
              </LayoutPreview>
            </DeviceFrame>
            <PreviewDescription>
              <b>flex-direction: column</b>. Aside on top.
            </PreviewDescription>
          </PreviewCard>

          {/* Reduced Motion */}
          <PreviewCard>
            <PreviewLabel>
              <PreviewTitle>Reduced Motion</PreviewTitle>
              <PreviewDimensions>prefers-reduced-motion</PreviewDimensions>
            </PreviewLabel>
            <DeviceFrame $width={1440} $height={900}>
              <PreviewNav />
              <LayoutPreview $direction="row">
                <PreviewAside>
                  <MiniCircle />
                  <MiniTriangle />
                  <MiniCircle />
                  <MiniCircle />
                  <MiniCircle />
                </PreviewAside>
                <PreviewMain>
                  <PreviewHero $fontSize={24}>
                    <span>Marc</span>
                    <span>
                      Ll<PreviewAccent>o</PreviewAccent>bet
                    </span>
                  </PreviewHero>
                  <PreviewShape $size={40} />
                </PreviewMain>
              </LayoutPreview>
            </DeviceFrame>
            <PreviewDescription>
              <b>No animations</b>. Static shape.
            </PreviewDescription>
          </PreviewCard>
        </LayoutRowGrid>
      </Section>

      {/* Section Layout */}
      <Section>
        <SectionTitle>Section Layout</SectionTitle>
        <PreviewGrid>
          {/* Desktop */}
          <PreviewCard>
            <PreviewLabel>
              <PreviewTitle>Desktop</PreviewTitle>
              <PreviewDimensions>&gt;900px · text 30ch</PreviewDimensions>
            </PreviewLabel>
            <DeviceFrame $width={1440} $height={900}>
              <SectionPreviewWrapper $direction="row">
                <SectionPreviewTitle $fontSize={18}>
                  fluency-rep<PreviewAccent>o</PreviewAccent>rt
                </SectionPreviewTitle>
                <SectionText $width="35%" $gap={8}>
                  <TextLine $width="100%" />
                  <TextLine $width="90%" />
                  <TextLine $width="95%" />
                  <TextLine $width="60%" />
                  <div style={{ marginTop: 4 }}>
                    <TextLine $width="70%" />
                    <TextLineAccent $width="40%" style={{ marginTop: 4 }} />
                  </div>
                  <SectionLinks>
                    <LinkPlaceholder />
                    <LinkPlaceholder />
                  </SectionLinks>
                </SectionText>
                <SectionImage $width="55%" $order={1} />
              </SectionPreviewWrapper>
            </DeviceFrame>
            <PreviewDescription>
              Layout <b>flex row</b>. Text on the left (30ch), image on the
              right (order: 1). Element gap: 2rem.
            </PreviewDescription>
          </PreviewCard>

          {/* Mobile */}
          <PreviewCard>
            <PreviewLabel>
              <PreviewTitle>Mobile</PreviewTitle>
              <PreviewDimensions>≤900px · text 100%</PreviewDimensions>
            </PreviewLabel>
            <DeviceFrame $width={375} $height={667}>
              <SectionPreviewWrapper $direction="column" $centerVertical>
                <SectionPreviewTitle $fontSize={14}>
                  fluency-rep<PreviewAccent>o</PreviewAccent>rt
                </SectionPreviewTitle>
                <SectionImage $width="100%" $order={0} />
                <SectionText $width="100%" $gap={6}>
                  <TextLine $width="100%" />
                  <TextLine $width="90%" />
                  <TextLine $width="95%" />
                  <TextLine $width="60%" />
                  <div style={{ marginTop: 2 }}>
                    <TextLine $width="70%" />
                    <TextLineAccent $width="40%" style={{ marginTop: 2 }} />
                  </div>
                  <SectionLinks>
                    <LinkPlaceholder />
                    <LinkPlaceholder />
                  </SectionLinks>
                </SectionText>
              </SectionPreviewWrapper>
            </DeviceFrame>
            <PreviewDescription>
              Image first (<b>order: 0</b>), text below. Text takes 100% width
              (max 32ch). Reduced gap to 1rem.
            </PreviewDescription>
          </PreviewCard>

          {/* Landscape */}
          <PreviewCard>
            <PreviewLabel>
              <PreviewTitle>Landscape</PreviewTitle>
              <PreviewDimensions>max-height: 400px</PreviewDimensions>
            </PreviewLabel>
            <DeviceFrame $width={844} $height={390}>
              <SectionPreviewWrapper $direction="row">
                <SectionPreviewTitle $fontSize={12}>
                  fluency-rep<PreviewAccent>o</PreviewAccent>rt
                </SectionPreviewTitle>
                <SectionText $width="50%" $gap={4}>
                  <TextLine $width="100%" />
                  <TextLine $width="90%" />
                  <TextLine $width="95%" />
                  <TextLine $width="60%" />
                  <div style={{ marginTop: 2 }}>
                    <TextLine $width="70%" />
                    <TextLineAccent $width="40%" style={{ marginTop: 2 }} />
                  </div>
                  <SectionLinks>
                    <LinkPlaceholder />
                    <LinkPlaceholder />
                  </SectionLinks>
                </SectionText>
                <SectionImage $width="35%" $order={1} />
              </SectionPreviewWrapper>
            </DeviceFrame>
            <PreviewDescription>
              Smaller image (<b>max 250px</b>), order: 1. padding-block-start:
              4dvw to compensate for aside.
            </PreviewDescription>
          </PreviewCard>

          {/* Tablet */}
          <PreviewCard>
            <PreviewLabel>
              <PreviewTitle>Tablet</PreviewTitle>
              <PreviewDimensions>600-900px</PreviewDimensions>
            </PreviewLabel>
            <DeviceFrame $width={768} $height={1024}>
              <SectionPreviewWrapper $direction="column" $centerVertical>
                <SectionPreviewTitle $fontSize={16}>
                  fluency-rep<PreviewAccent>o</PreviewAccent>rt
                </SectionPreviewTitle>
                <SectionImage $width="80%" $order={0} />
                <SectionText $width="100%" $gap={6}>
                  <TextLine $width="100%" />
                  <TextLine $width="90%" />
                  <TextLine $width="95%" />
                  <TextLine $width="60%" />
                  <div style={{ marginTop: 2 }}>
                    <TextLine $width="70%" />
                    <TextLineAccent $width="40%" style={{ marginTop: 2 }} />
                  </div>
                  <SectionLinks>
                    <LinkPlaceholder />
                    <LinkPlaceholder />
                  </SectionLinks>
                </SectionText>
              </SectionPreviewWrapper>
            </DeviceFrame>
            <PreviewDescription>
              Breakpoint ≤900px active: image first, text 100%. Image limited to
              max 450px.
            </PreviewDescription>
          </PreviewCard>
        </PreviewGrid>
      </Section>
    </PageWrapper>
  );
}
