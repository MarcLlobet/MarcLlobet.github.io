"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../../utils/useMediaQuery";
import {
  axis,
  BEAMS,
  beamMatrix,
  beamStart,
  multiply,
  quat,
  RIGHT,
  sceneMatrix,
  UP,
  type Vec3,
} from "./triangle";
import { createRenderer, type FaceColours, type Rgb } from "./renderer";
import { Canvas, Count, Digits, Hud } from "./ScrollScene.styles";

/** Ids of the elements the scene reads; the page renders them. */
export const SCENE = {
  heroSlot: "scene-slot-hero",
  endSlot: "scene-slot-end",
  work: "main-content",
  footer: "site-footer",
  hud: "scene-hud",
} as const;

const INTRO_DELAY = 0.35;
const INTRO_STAGGER = 0.18;
const INTRO_DURATION = 1.5;
const INTRO_END = INTRO_DELAY + 2 * INTRO_STAGGER + INTRO_DURATION;

const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));
const easeInOut = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
const pad = (n: number) => String(n).padStart(2, "0");
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/* Colours: three visible faces (top, side, front) plus the hidden ones */
const hex = (value: string): Rgb => {
  const n = parseInt(value.replace("#", "").slice(0, 6), 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
const mix = (a: Rgb, b: Rgb, k: number): Rgb => [
  lerp(a[0], b[0], k),
  lerp(a[1], b[1], k),
  lerp(a[2], b[2], k),
];
const WHITE: Rgb = [1, 1, 1];
const INK = hex("#0E0E0C");

/** Face order: ±x side, ±y top, ±z front (opposite faces share a colour). */
const faces = (top: Rgb, side: Rgb, front: Rgb): FaceColours => [
  side,
  side,
  top,
  top,
  front,
  front,
];
const fromAccent = (accent: string): FaceColours => {
  const c = hex(accent);
  return faces(mix(c, WHITE, 0.35), c, mix(c, INK, 0.55));
};
const MONO_DARK = faces(hex("#EDECE6"), hex("#8A8880"), hex("#2E2E2B"));
const MONO_LIGHT = faces(hex("#9A948A"), hex("#3F3B36"), hex("#1C1B19"));

type Anchor = { x: number; y: number; size: number };

const anchorOf = (element: Element | null): Anchor | null => {
  if (!element) return null;
  const r = element.getBoundingClientRect();
  return {
    x: r.left + r.width / 2,
    y: r.top + r.height / 2,
    size: Math.min(r.width, r.height * 1.1),
  };
};

export type ScrollSceneProps = {
  /** Number of featured projects, for the counter. */
  total: number;
};

/**
 * Directs the page while it scrolls: reveals each project (--p, --q), sets the
 * accent of the project in view, runs the counter, and flies the impossible
 * triangle (WebGL) from the hero to the counter, through every project and to
 * the footer.
 */
export const ScrollScene = ({ total }: ScrollSceneProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const digitsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof requestAnimationFrame === "undefined") return;
    const renderer = createRenderer(canvas);
    if (!renderer) return;

    const reduced = prefersReducedMotion();
    const coarse =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches;
    const html = document.documentElement;
    html.dataset.scene = "on";

    const pointer = { x: -1, y: -1 };
    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", renderer.resize);

    const tumbleAxis = axis(1, 0.35);
    const wobbleAxis = axis(0.3, 1);
    const finaleAxis = axis(1, -0.6);
    const starts = BEAMS.map((beam) => beamStart(beam.home, beam.from));

    const t0 = performance.now();
    let colours: FaceColours = MONO_DARK.map((c) => [...c]) as FaceColours;
    let tiltX = 0;
    let tiltY = 0;
    let pulse = 0;
    let lastLock = -1;
    let lastActive = -2;
    let introPulsed = false;
    let frame = 0;

    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      /* Intro: the three beams fly in and lock */
      const beams = BEAMS.map((beam, i) => {
        const k = reduced
          ? 1
          : easeOutExpo(
              clamp((t - INTRO_DELAY - i * INTRO_STAGGER) / INTRO_DURATION),
            );
        const position = beam.home.map((v, j) =>
          lerp(starts[i][j], v, k),
        ) as Vec3;
        const spin = beam.spin.map((angle) => angle * (1 - k)) as Vec3;
        return beamMatrix(position, spin);
      });
      const assembled = reduced || t > INTRO_END;
      if (assembled && !introPulsed) {
        introPulsed = true;
        pulse = reduced ? 0 : 1;
      }

      /* Projects: reveal progress, and which one is in the middle */
      const cases = [...document.querySelectorAll<HTMLElement>("[data-case]")];
      const centres = cases.map((element) => {
        const rect = (
          element.querySelector("[data-frame]") ?? element
        ).getBoundingClientRect();
        if (!reduced) {
          const p = clamp((vh - rect.top) / (vh * 0.7));
          const q = clamp((vh - rect.top) / (vh / 2 + rect.height / 2));
          element.style.setProperty("--p", p.toFixed(3));
          element.style.setProperty("--q", q.toFixed(3));
        }
        return rect.top + rect.height / 2;
      });
      let index = -1;
      centres.forEach((centre, i) => {
        if (centre <= vh / 2) index = i;
      });
      const frac =
        index >= 0 && index < centres.length - 1
          ? clamp(
              (vh / 2 - centres[index]) / (centres[index + 1] - centres[index]),
            )
          : 0;

      /* Counter and accent while the work section is in view */
      const work = document.getElementById(SCENE.work)?.getBoundingClientRect();
      const inWork = !!work && work.top < vh / 2 && work.bottom > vh / 2;
      const hud = hudRef.current;
      hud?.toggleAttribute("data-on", inWork);
      const active = inWork ? Math.max(0, frac < 0.5 ? index : index + 1) : -1;
      if (active !== lastActive) {
        lastActive = active;
        if (active >= 0 && cases[active]) {
          html.style.setProperty(
            "--scene-accent",
            cases[active].dataset.accent ?? "",
          );
          digitsRef.current?.style.setProperty(
            "transform",
            `translateY(${-active * 1.3}em)`,
          );
        } else {
          html.style.removeProperty("--scene-accent");
        }
      }

      /* Where the triangle is: hero → counter → footer */
      const heroAnchor = anchorOf(document.getElementById(SCENE.heroSlot));
      const endAnchor = anchorOf(document.getElementById(SCENE.endSlot));
      const hudRect = hud?.getBoundingClientRect();
      const rtl = hud ? getComputedStyle(hud).direction === "rtl" : false;
      const hudAnchor: Anchor | null = hudRect
        ? {
            x: rtl ? hudRect.right - 32 : hudRect.left + 32,
            y: hudRect.top + hudRect.height / 2,
            size: 40,
          }
        : null;
      if (!heroAnchor) {
        frame = requestAnimationFrame(tick);
        return;
      }

      const workTop = document.getElementById(SCENE.work)?.offsetTop ?? vh;
      const s =
        reduced || !hudAnchor
          ? 0
          : easeInOut(clamp(window.scrollY / Math.max(1, workTop - vh * 0.35)));
      const footerTop =
        document.getElementById(SCENE.footer)?.getBoundingClientRect().top ??
        Infinity;
      const f =
        reduced || !endAnchor
          ? 0
          : easeInOut(clamp((vh - footerTop) / (vh * 0.85)));

      const to = hudAnchor ?? heroAnchor;
      let x = lerp(heroAnchor.x, to.x, s);
      let y = lerp(heroAnchor.y, to.y, s);
      let size = lerp(heroAnchor.size, to.size, s);
      if (endAnchor) {
        x = lerp(x, endAnchor.x, f);
        y = lerp(y, endAnchor.y, f);
        size = lerp(size, endAnchor.size, f);
      }

      /* Between projects it comes apart; on each one it locks back */
      const travelling = s >= 1 && f <= 0 && index >= 0;
      const wobble =
        travelling && !reduced ? Math.sin(Math.PI * frac) * 0.9 : 0;
      const lock = travelling ? (frac < 0.5 ? index : index + 1) : -1;
      if (travelling && lock !== lastLock && (frac < 0.04 || frac > 0.96)) {
        lastLock = lock;
        pulse = 1;
      }

      /* In the hero, the pointer tilts it and reveals the trick */
      let targetX = 0;
      let targetY = 0;
      if (!reduced && assembled) {
        if (coarse) {
          const reveal = Math.pow(Math.max(0, Math.sin(t * 0.7)), 12);
          targetX = reveal * 0.55;
          targetY = reveal * -0.3;
        } else if (pointer.x >= 0) {
          targetX = (pointer.x / vw - 0.5) * 0.9;
          targetY = (pointer.y / vh - 0.5) * 0.7;
        }
      }
      tiltX += (targetX * (1 - s) - tiltX) * 0.08;
      tiltY += (targetY * (1 - s) - tiltY) * 0.08;

      const rotation = [
        quat(finaleAxis, f * Math.PI * 2),
        quat(tumbleAxis, s * Math.PI * 2),
        quat(wobbleAxis, wobble),
        quat(UP, tiltX),
        quat(RIGHT, tiltY),
      ].reduce(multiply);

      /* Colour: monochrome in the hero and footer, the project's accent between */
      let target = html.classList.contains("light-theme")
        ? MONO_LIGHT
        : MONO_DARK;
      if (travelling && cases[index]) {
        const from = fromAccent(cases[index].dataset.accent ?? "#888888");
        const next = cases[Math.min(index + 1, cases.length - 1)];
        const into = fromAccent(next.dataset.accent ?? "#888888");
        const k = frac * frac * (3 - 2 * frac);
        target = from.map((c, i) => mix(c, into[i], k)) as FaceColours;
      }
      colours = colours.map((c, i) => mix(c, target[i], 0.08)) as FaceColours;

      pulse *= 0.9;
      if (pulse < 0.001) pulse = 0;
      renderer.draw(
        sceneMatrix(x, y, size * (1 + pulse * 0.12), rotation),
        beams,
        colours,
      );
      canvas.setAttribute("data-ready", "");

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", renderer.resize);
      delete html.dataset.scene;
      html.style.removeProperty("--scene-accent");
    };
  }, []);

  return (
    <>
      <Canvas ref={canvasRef} aria-hidden="true" />
      {total > 0 && (
        <Hud ref={hudRef} id={SCENE.hud} aria-hidden="true">
          <Count>
            <Digits ref={digitsRef}>
              {Array.from({ length: total }, (_, i) => (
                <span key={i}>{pad(i + 1)}</span>
              ))}
            </Digits>
          </Count>
          <span>/ {pad(total)}</span>
        </Hud>
      )}
    </>
  );
};
