"use client";

import { createGlobalStyle } from "styled-components";

const Satoshi = `
@font-face {
  font-family: 'Satoshi';
  src: url('/fonts/satoshi/Satoshi-Variable.woff2') format('woff2');
  font-weight: 300 900;
  font-display: swap;
  font-style: normal;
}

:root {
  --satoshi-stack: 'Satoshi', system-ui, -apple-system, BlinkMacSystemFont,
             'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --satoshi-weight-light: 300;
  --satoshi-weight-regular: 400;
  --satoshi-weight-medium: 500;
  --satoshi-weight-bold: 700;
  --satoshi-weight-black: 900;
}
`;

const Stardom = `
@font-face {
  font-family: 'Stardom';
  src: url('/fonts/stardom/Stardom-Regular.woff2') format('woff2');
  font-display: swap;
  font-style: normal;
  font-weight: 400;
}

:root {
  --stardom-stack: 'Stardom', Georgia, 'Times New Roman', Times, serif;
}
`;

const GenericStyles = `
:root {
  --golden-ratio: 1.61803398875;

  /* Spacing scale. Use these instead of multiplying --spacing. */
  --space-3xs: 0.25rem;
  --space-2xs: 0.5rem;
  --space-xs: 0.75rem;
  --space-s: 1rem;
  --space-m: 1.5rem;
  --space-l: 2rem;
  --space-xl: 3rem;
  --space-2xl: 4rem;
  /* Legacy alias, kept for the design page and stories */
  --spacing: var(--space-s);

  /* Fluid layout spacing: grows with the screen, no breakpoints needed */
  --space-gutter: clamp(var(--space-s), 0.5rem + 2.5vw, var(--space-xl));
  --space-stack: clamp(var(--space-xs), 2svh, var(--space-m));
  --space-section-end: clamp(var(--space-s), 4svh, var(--space-xl));
  --space-rail: clamp(var(--space-2xs), 4svh, var(--nav-block-size));

  /* Component sizes */
  --nav-block-size: 3.5rem;
  --tap-target: 2.75rem;
  --shape-size: clamp(64px, 10vmin + 2rem, 180px);
  --selector-size: 20px;
  font-family: var(--satoshi-stack);
  line-height: 1.5;
  font-weight: 400;

  color-scheme: dark light;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --color-bg: #141518;
  --color-text: #D1CDC4;
  --color-heading: #E9CFA4;
  --color-muted: #8E8A80;
  --color-accent: #B0483A;
}

html.light-theme {
  --color-bg: #F4F1EB;
  --color-heading: #2E2A25;
  --color-text: #3F3B36;
  --color-muted: #7A736B;
  --color-accent: #B0483A;
}

* {
  box-sizing: border-box;
}

#root {
  display: flex;
  scroll-snap-align: start;
  inline-size: 100%;
  min-block-size: 100svh;
  /* Same gutter on both sides; safe-area-inset-* are physical by spec */
  padding-inline: max(var(--space-gutter), env(safe-area-inset-left))
    max(var(--space-gutter), env(safe-area-inset-right));
}

/* Touch screens get bigger targets for the section selectors */
@media (pointer: coarse) {
  :root {
    --selector-size: 24px;
  }
}

@media (prefers-reduced-motion: no-preference) {
  html {
    /* Native smooth scrolling for every #anchor link: no JS needed */
    scroll-behavior: smooth;
  }
}

html {
  /* 16px on phones, growing to 20px on large screens */
  font-size: clamp(1rem, 0.85rem + 0.7vmin, 1.25rem);
  /* Every project fits one screen, so each scroll lands on one project */
  scroll-snap-type: y mandatory;
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
  color: var(--color-accent);
}

button {
  color: var(--color-muted);
}

button:hover {
  color: var(--color-accent);
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
  background: var(--color-accent);
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
}

p {
  display: block;
  margin-block-start: 0;
  margin-block-end: 0;
}

b {
  font-weight: var(--satoshi-weight-bold);
}

h2,h3,h4,h5,h6 {
  color: var(--color-heading);
  display: block;
  font-family: var(--stardom-stack);
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
  ${Satoshi}
  ${Stardom}
  ${GenericStyles}
`;
