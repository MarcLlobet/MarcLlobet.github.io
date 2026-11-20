"use client";

import styled, { css } from "styled-components";

/* Fixed layer over the page; the triangle inside is placed by a matrix3d */
export const Stage = styled.div`
  position: fixed;
  inset: 0;
  z-index: 35;
  pointer-events: none;
  opacity: 0;
  transition:
    opacity 0.4s,
    --tri 0.6s ease;

  &[data-ready] {
    opacity: 1;
  }
`;

export const TriangleRoot = styled.div`
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  transform-style: preserve-3d;
  will-change: transform;
`;

const face = (
  name: string,
  inline: number,
  block: number,
  transform: string,
  color: string,
) => css`
  & > [data-face="${name}"] {
    inline-size: ${inline}px;
    block-size: ${block}px;
    transform: ${transform} translate(-50%, -50%);
    background: ${color};
  }
`;

const TOP = "color-mix(in srgb, var(--tri) 62%, white)";
const SIDE = "var(--tri)";
const FRONT = "color-mix(in srgb, var(--tri) 45%, black)";
const HIDDEN = "color-mix(in srgb, var(--tri) 30%, black)";

/* A box of $w × $h × $d world units: six faces around its centre */
export const Beam = styled.div<{ $w: number; $h: number; $d: number }>`
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  transform-style: preserve-3d;

  & > [data-face] {
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
  }

  ${({ $w, $h, $d }) => css`
    ${face("px", $d, $h, `rotateY(90deg) translateZ(${$w / 2}px)`, SIDE)}
    ${face("nx", $d, $h, `rotateY(-90deg) translateZ(${$w / 2}px)`, HIDDEN)}
    ${face("py", $w, $d, `rotateX(-90deg) translateZ(${$h / 2}px)`, TOP)}
    ${face("ny", $w, $d, `rotateX(90deg) translateZ(${$h / 2}px)`, HIDDEN)}
    ${face("pz", $w, $h, `translateZ(${$d / 2}px)`, FRONT)}
    ${face("nz", $w, $h, `rotateY(180deg) translateZ(${$d / 2}px)`, HIDDEN)}
  `}
`;

const mono = css`
  font-family: var(--mono-stack);
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

/* Counter of the project in view; the triangle docks in its empty start */
export const Hud = styled.div`
  ${mono}
  position: fixed;
  z-index: 30;
  inset-inline-start: max(1rem, env(safe-area-inset-left, 0px));
  inset-block-end: calc(1rem + env(safe-area-inset-bottom, 0px));
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-block-size: 3rem;
  padding-block: 0.5rem;
  padding-inline: 4rem 0.75rem;
  background: var(--color-bg);
  border: 1px solid var(--color-line);
  color: var(--color-text);
  pointer-events: none;
  opacity: 0;
  transform: translateY(0.5rem);
  transition:
    opacity 0.4s,
    transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);

  &[data-on] {
    opacity: 1;
    transform: none;
  }
`;

export const Count = styled.span`
  display: inline-block;
  block-size: 1.3em;
  line-height: 1.3em;
  overflow: hidden;
`;

export const Digits = styled.span`
  display: flex;
  flex-direction: column;
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
`;
