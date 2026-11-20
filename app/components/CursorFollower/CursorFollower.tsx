"use client";

import { useEffect, useRef } from "react";
import styled from "styled-components";
import { RICH_POINTER, useMediaQuery } from "../../utils/useMediaQuery";

const Dot = styled.div`
  position: fixed;
  inset-block-start: 0;
  inset-inline-start: 0;
  z-index: 70;
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: 0.75rem;
  block-size: 0.75rem;
  border-radius: 50%;
  background: var(--color-text);
  mix-blend-mode: difference;
  pointer-events: none;
  transition:
    inline-size 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
    block-size 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
    background-color 0.3s;

  &[data-active] {
    inline-size: 7.5rem;
    block-size: 7.5rem;
    background: var(--scene-accent);
    mix-blend-mode: normal;
  }
`;

const Label = styled.span`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
  color: #0e0e0c;
  opacity: 0;
  transition: opacity 0.2s;

  [data-active] > & {
    opacity: 1;
  }
`;

const Follower = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;
    const html = document.documentElement;
    html.setAttribute("data-cursor-follower", "");
    const target = { x: -100, y: -100 };
    const position = { x: -100, y: -100 };
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      const over = (event.target as Element | null)?.closest?.("[data-cursor]");
      dot.toggleAttribute("data-active", !!over);
      if (over && labelRef.current) {
        labelRef.current.textContent = over.getAttribute("data-cursor");
      }
    };
    const tick = () => {
      position.x += (target.x - position.x) * 0.2;
      position.y += (target.y - position.y) * 0.2;
      dot.style.transform = `translate3d(${position.x.toFixed(1)}px, ${position.y.toFixed(1)}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
      html.removeAttribute("data-cursor-follower");
    };
  }, []);

  return (
    <Dot ref={dotRef} dir="ltr" aria-hidden="true">
      <Label ref={labelRef} />
    </Dot>
  );
};

/** A dot that follows the pointer and turns into a label over [data-cursor]. */
export const CursorFollower = () => {
  const enabled = useMediaQuery(RICH_POINTER);
  return enabled ? <Follower /> : null;
};
