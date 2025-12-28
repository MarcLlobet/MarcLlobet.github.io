import { createGlobalStyle } from "styled-components"
import { Stardom } from "./fonts/stardom/stardom";
import { Satoshi } from "./fonts/satoshi/satoshi";

export const GenericStyles = `
:root {

  --golden-ratio: 1.61803398875;
  font-family: var(--satoshi-stack);
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --color-bg: #141518;
  --color-text: #D1CDC4;
  --color-heading: #E9CFA4;
  --color-muted: #8E8A80;
  --color-accent: #B0483A;

  // opcio heavy
  // --color-bg: #0B0A0F;
  // --color-heading: #C6B7FF;
  // --color-text: #E0DEE8;
  // --color-muted: #9B97A6;
  // --color-accent: #6E4AE3;
}

* {
  box-sizing: border-box;
}

#root {
  width: 100%;
  height: 100%;
  max-width: 100dvw;
  max-height: 100dvh;
  position: relative;
  display: flex;
  scroll-snap-align: start;
}

html {
  font-size: 20px;
  scroll-snap-type: y mandatory;
  background-color: var(--color-bg);
  color: var(--color-text);
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

body {
  margin: 0;
  min-width: 100dvw;
  min-height: 100dvh;
  width: 100%;
  height: 100%;
}

p {
  display: block;
  margin-block-start: 0;
  margin-block-end: 0;
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
  padding-block-end: calc(1rem * var(--golden-ratio) * 1);
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

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
}
`;

export const GlobalStyles = createGlobalStyle`
  ${Satoshi}
  ${Stardom}
  ${GenericStyles}
`