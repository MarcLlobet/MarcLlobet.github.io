"use client";

import { createGlobalStyle } from "styled-components";
import { THEME_REVEAL_MS } from "./utils/theme";

/*
 * Typography: Space Grotesk for everything you read, JetBrains Mono for
 * labels, counters and metadata. Both are variable fonts, self-hosted and
 * loaded via next/font/local (app/fonts.ts), which sets --font-sans and
 * --font-mono on <html> — so they're not redeclared here.
 */
const FontWeights = `
:root {
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
  --vt-x: 100%;
  --vt-y: 0%;
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
  /* One signature accent, not a borrowed one: the accent is the project in view */
  --color-accent: var(--scene-accent);
  --color-accent-text: var(--color-heading);
  /* Focus/hover highlight: the page's own ink, not the scrolling project accent */
  --color-focus: var(--color-heading);

  /*
   * One flat signature colour, deliberately not a ramp: every project reads
   * the same acid-lime rather than a different hue or intensity. The six
   * tokens stay independent (not a single variable) so a second signature
   * colour can take over some of these slots later without a rearchitect.
   * See the Colour section of /design for the full reasoning.
   */
  --accent-1: #D5EF2C;
  --accent-2: #D5EF2C;
  --accent-3: #D5EF2C;
  --accent-4: #D5EF2C;
  --accent-5: #D5EF2C;
  --accent-6: #D5EF2C;

  /* Mockup colour roles */
  --mk-surf: #161614;
  --mk-head: #121210;
  --mk-ink: #EDECE6;
  --mk-bar: #2A2A27;
  --mk-bar2: #3A3A36;
  --mk-grey: #6B6A64;

  /* Accent of the project in view; the scene changes it while scrolling */
  --scene-accent: var(--accent-1);
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
  --accent-1: #D5EF2C;
  --accent-2: #D5EF2C;
  --accent-3: #D5EF2C;
  --accent-4: #D5EF2C;
  --accent-5: #D5EF2C;
  --accent-6: #D5EF2C;

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
  initial-value: #D5EF2C;
}

/*
 * Theme toggle: a diagonal band sweeps the new theme in — left-to-right on a
 * landscape screen, top-to-bottom on a portrait one, so the sweep always
 * runs along the viewport's long axis — with an accent-coloured glow riding
 * its leading edge (a drop-shadow follows the clip-path's own silhouette,
 * which a box-shadow can't). The old snapshot is left fully opaque (its
 * default fade-out animation turned off) so it stays put underneath as the
 * new one sweeps over it. No-ops entirely where startViewTransition isn't
 * called.
 */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-new(root) {
  animation: theme-reveal ${THEME_REVEAL_MS}ms cubic-bezier(0.65, 0, 0.35, 1)
    forwards;
  filter: drop-shadow(0 0 2vmax var(--color-accent));
}

@keyframes theme-reveal {
  from {
    clip-path: polygon(0% 0%, -18% 0%, -36% 100%, 0% 100%);
  }
  to {
    clip-path: polygon(0% 0%, 118% 0%, 100% 100%, 0% 100%);
  }
}

@media (orientation: portrait) {
  ::view-transition-new(root) {
    animation-name: theme-reveal-portrait;
  }

  @keyframes theme-reveal-portrait {
    from {
      clip-path: polygon(0% 0%, 100% 0%, 100% -36%, 0% -18%);
    }
    to {
      clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 118%);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none !important;
    filter: none !important;
  }
}

/*
 * The dot is the pointer: while it follows, nothing draws a cursor. It only
 * mounts on a fine pointer, so the attribute is the whole condition. The
 * attribute is repeated to outweigh the components that set a pointer
 * cursor of their own.
 */
html[data-cursor-follower][data-cursor-follower],
html[data-cursor-follower][data-cursor-follower] * {
  cursor: none;
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
  position: relative;
}

button {
  color: var(--color-muted);
  position: relative;
}

/*
 * Hover: no colour change, a line that wipes in from the start of the word and
 * leaves through its end. --line paints it (a project accent where there is
 * one); setting content: none on the ::after opts an element out.
 */
a::after,
button::after {
  content: "";
  position: absolute;
  inset-inline: 0;
  inset-block-end: calc(50% - 0.82em);
  block-size: 2px;
  background: var(--line, currentColor);
  transform: scaleX(0);
  transform-origin: 100% 50%;
  transition: transform 0.45s cubic-bezier(0.65, 0, 0.35, 1);
  pointer-events: none;
}

a:dir(rtl)::after,
button:dir(rtl)::after {
  transform-origin: 0 50%;
}

a:hover::after,
a:focus-visible::after,
button:hover::after,
button:focus-visible::after {
  transform: scaleX(1);
  transform-origin: 0 50%;
}

a:hover:dir(rtl)::after,
a:focus-visible:dir(rtl)::after,
button:hover:dir(rtl)::after,
button:focus-visible:dir(rtl)::after {
  transform-origin: 100% 50%;
}

/*
 * Focus styles for accessibility: a stable ink colour, not the scrolling
 * project accent, so the ring reads the same no matter where on the page
 * (or in which theme) it appears.
 */
:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--color-focus);
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

.skip-to-content::after {
  content: none;
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
  ${FontWeights}
  ${GenericStyles}
`;
