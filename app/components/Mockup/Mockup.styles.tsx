"use client";

import styled, { css, keyframes } from "styled-components";

const pulse = keyframes`
  50% { transform: scale(1.6); }
`;
const lift = keyframes`
  50% { transform: translateY(-8%); }
`;
const wave = keyframes`
  50% { opacity: 0.12; }
`;
const blink = keyframes`
  50% { opacity: 0.2; }
`;
const flip = keyframes`
  0%, 30%, 100% { transform: scaleY(1); }
  15% { transform: scaleY(0.06); }
`;
const flow = keyframes`
  to { stroke-dashoffset: -0.05; }
`;

/* Hover loops play while the frame is hovered ([data-play="hover"]) or always ([data-play="always"]) */
const loops = css`
  .loop-pulse {
    animation: ${pulse} 1.6s ease-in-out infinite;
    animation-delay: calc(var(--i, 0) * -4.8s);
  }
  .loop-lift {
    animation: ${lift} 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
    animation-delay: calc(var(--i, 0) * -3.6s);
  }
  .loop-wave {
    animation: ${wave} 2.2s ease-in-out infinite;
    animation-delay: calc(var(--i, 0) * -6.6s);
  }
  .loop-blink {
    animation: ${blink} 1s steps(2) infinite;
  }
  .loop-flip {
    animation: ${flip} 3s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
    animation-delay: calc(var(--i, 0) * 1.5s);
  }
  .draw {
    stroke-dasharray: 0.03 0.02;
    animation: ${flow} 1.2s linear infinite;
  }
`;

export const MockupBox = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: var(--mk-surf);
`;

export const MockupSvg = styled.svg`
  display: block;
  inline-size: 100%;
  block-size: 100%;
  transition: transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);

  .fill-surf {
    fill: var(--mk-surf);
  }
  .fill-head {
    fill: var(--mk-head);
  }
  .fill-ink {
    fill: var(--mk-ink);
  }
  .fill-bar {
    fill: var(--mk-bar);
  }
  .fill-bar2 {
    fill: var(--mk-bar2);
  }
  .fill-grey {
    fill: var(--mk-grey);
  }
  .fill-acc {
    fill: var(--c, var(--scene-accent));
  }
  .stroke-bar2 {
    fill: none;
    stroke: var(--mk-bar2);
  }
  .stroke-acc {
    fill: none;
    stroke: var(--c, var(--scene-accent));
  }

  /* Scroll: --q (0..1, set on the project) builds every shape in its --i order */
  .build {
    --k: clamp(0, calc((var(--q, 1) * 1.35 - var(--i, 0)) * 5), 1);
    opacity: var(--k);
    transform-box: fill-box;
    transform-origin: center;
    transform: scale(calc(0.5 + var(--k) * 0.5));
  }
  .draw {
    stroke-dasharray: 1;
    stroke-dashoffset: calc(1 - clamp(0, calc(var(--q, 1) * 1.25 - 0.15), 1));
  }

  [data-play="hover"]:hover & {
    transform: translateY(-2%);
    ${loops}
  }
  [data-play="always"] & {
    ${loops}
  }

  @media (prefers-reduced-motion: reduce) {
    .build {
      opacity: 1;
      transform: none;
    }
    .draw {
      stroke-dashoffset: 0;
    }
    [data-play] &,
    [data-play] & * {
      animation: none;
      transform: none;
    }
  }
`;
