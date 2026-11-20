"use client";

import { createGlobalStyle } from "styled-components";

/*
 * Typography: Space Grotesk for everything you read, JetBrains Mono for
 * labels, counters and metadata. Both are variable fonts served from /fonts.
 */
const Fonts = `
@font-face {
  font-family: 'Space Grotesk';
  src: url('/fonts/space-grotesk/SpaceGrotesk-Variable.woff2') format('woff2');
  font-weight: 300 700;
  font-display: swap;
  font-style: normal;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/jetbrains-mono/JetBrainsMono-Variable.woff2') format('woff2');
  font-weight: 100 800;
  font-display: swap;
  font-style: normal;
}

:root {
  --font-sans: 'Space Grotesk', system-ui, -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo,
    Consolas, 'Liberation Mono', monospace;
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
}
`;

const GenericStyles = `
:root {
  --golden-ratio: 1.61803398875;

  --space-3xs: 0.25rem;
  --space-2xs: 0.5rem;
  --space-xs: 0.75rem;
  --space-s: 1rem;
  --space-m: 1.5rem;
  --space-l: 2rem;
  --space-xl: 3rem;
  --space-2xl: 4rem;
  --spacing: var(--space-s);

  --space-gutter: clamp(var(--space-s), 0.5rem + 2.5vw, var(--space-xl));
  --space-stack: clamp(var(--space-xs), 2svh, var(--space-m));
  --space-section-end: clamp(var(--space-s), 4svh, var(--space-xl));
  --space-rail: clamp(var(--space-2xs), 4svh, var(--nav-block-size));

  --nav-block-size: 3.5rem;
  --tap-target: 2.75rem;
  --shape-size: clamp(64px, 10vmin + 2rem, 180px);
  --selector-size: 20px;
  font-family: var(--font-sans);
  line-height: 1.5;
  font-weight: 400;

  color-scheme: dark light;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --color-bg: #0E0E0C;
  --color-surface: #161614;
  --color-text: #EDECE6;
  --color-heading: #EDECE6;
  --color-muted: #9C9A92;
  --color-line: #2A2A27;
  --color-line-strong: #3A3A36;
  --color-accent: #B0483A;
  --color-accent-text: #C9685B;

  /* Mockup colour roles */
  --mk-surf: #161614;
  --mk-head: #121210;
  --mk-ink: #EDECE6;
  --mk-bar: #2A2A27;
  --mk-bar2: #3A3A36;
  --mk-grey: #6B6A64;

  /* Accent of the project in view; the scene changes it while scrolling */
  --scene-accent: #5B9BFF;
  transition: --scene-accent 0.8s ease;
}

html.light-theme {
  --color-bg: #F4F1EB;
  --color-surface: #EAE6DE;
  --color-heading: #1C1B19;
  --color-text: #2A2825;
  --color-muted: #5F5A53;
  --color-line: #D9D4CA;
  --color-line-strong: #C4BEB2;
  --color-accent: #B0483A;
  --color-accent-text: #B0483A;

  --mk-surf: #EAE6DE;
  --mk-head: #E0DBD1;
  --mk-ink: #2A2825;
  --mk-bar: #D3CDC2;
  --mk-bar2: #C2BBAE;
  --mk-grey: #99928A;
}

@property --scene-accent {
  syntax: '<color>';
  inherits: true;
  initial-value: #5B9BFF;
}


/* The drawn triangle in the hero is a fallback: hidden once the 3D one runs */
html[data-scene="on"] [data-scene-fallback] {
  visibility: hidden;
}

@media (hover: hover) and (pointer: fine) {
  html[data-cursor-follower] [data-cursor] {
    cursor: none;
  }
}

* {
  box-sizing: border-box;
}

#root {
  display: flex;
  inline-size: 100%;
  min-block-size: 100svh;
  padding-inline: max(var(--space-gutter), env(safe-area-inset-left))
    max(var(--space-gutter), env(safe-area-inset-right));
}

@media (pointer: coarse) {
  :root {
    --selector-size: 24px;
  }
}

@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

html {
  font-size: clamp(1rem, 0.85rem + 0.7vmin, 1.25rem);
  background-color: var(--color-bg);
  color: var(--color-text);
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

a {
  font-weight: 500;
  color: var(--color-muted);
  text-decoration: inherit;
}
a:hover {
  color: var(--color-accent-text);
}

button {
  color: var(--color-muted);
}

button:hover {
  color: var(--color-accent-text);
}

/* Focus styles for accessibility */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Skip to content link */
.skip-to-content {
  position: absolute;
  inset-block-start: -100%;
  inset-inline: 0;
  margin-inline: auto;
  inline-size: fit-content;
  padding-block: var(--space-2xs);
  padding-inline: var(--space-s);
  background: var(--color-accent-text);
  color: var(--color-bg);
  text-decoration: none;
  font-weight: 600;
  z-index: 1000;
  border-radius: 0 0 4px 4px;
}

.skip-to-content:focus {
  inset-block-start: 0;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

body {
  margin: 0;
  overflow: clip visible;
}

p {
  display: block;
  margin-block-start: 0;
  margin-block-end: 0;
}

b {
  font-weight: var(--font-weight-bold);
}

h2,h3,h4,h5,h6 {
  color: var(--color-heading);
  display: block;
  font-family: var(--font-sans);
  margin-block-start: 0;
  margin-block-end: 0;
}

h1 {
  color: var(--color-heading);
  font-size: calc(1rem * var(--golden-ratio) * 4);
  line-height: calc(1rem * var(--golden-ratio) * 3.5);
  margin-block-start: 0;
  margin-block-end: 0;
}

h2 {
  font-size: calc(1rem * var(--golden-ratio) * 5);
  padding-block-start: calc(1rem * var(--golden-ratio) * 5);
  padding-block-end: calc(1rem * var(--golden-ratio) * 5);
  line-height: calc(1rem * var(--golden-ratio) * 5);
}

h3 {
  font-size: calc(1rem * var(--golden-ratio) * 2);
  line-height: calc(1rem * var(--golden-ratio) * 2);
}

h4 {
  font-size: calc(1rem * var(--golden-ratio) * 3);
  padding-block-start: calc(1rem * var(--golden-ratio) * 3);
  padding-block-end: calc(1rem * var(--golden-ratio) * 3);
  line-height: calc(1rem * var(--golden-ratio) * 3);
}

h5 {
  font-size: calc(1rem * var(--golden-ratio) * 2);
  padding-block-start: calc(1rem * var(--golden-ratio) * 2);
  padding-block-end: calc(1rem * var(--golden-ratio) * 2);
  line-height: calc(1rem * var(--golden-ratio) * 2);
}

h6 {
  font-size: calc(1rem * var(--golden-ratio) * 1);
  padding-block-start: calc(1rem * var(--golden-ratio) * 1);
  padding-block-end: calc(1rem * var(--golden-ratio) * 1);
  line-height: calc(1rem * var(--golden-ratio) * 1);
}
`;

export const GlobalStyles = createGlobalStyle`
  ${Fonts}
  ${GenericStyles}
`;
