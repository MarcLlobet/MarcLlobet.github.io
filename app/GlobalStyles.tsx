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
  --spacing: 1rem;
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
  inline-size: 100dvw;
  padding-inline: var(--spacing) calc(var(--spacing) * 2);
}

@media (orientation: landscape) and (max-height: 400px){
  #root {
    padding-inline: calc(var(--spacing) * 4);
  }
}

html {
  font-size: 20px;
  scroll-snap-type: y mandatory;
  background-color: var(--color-bg);
  color: var(--color-text);
}

@media (max-width: 600px) {
  html {
    font-size: 16px;
  }
}

@media (orientation: landscape) and (max-height: 400px){
  html {
    font-size: 14px;
  }
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
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem 1rem;
  background: var(--color-accent);
  color: var(--color-bg);
  text-decoration: none;
  font-weight: 600;
  z-index: 1000;
  border-radius: 0 0 4px 4px;
}

.skip-to-content:focus {
  top: 0;
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
