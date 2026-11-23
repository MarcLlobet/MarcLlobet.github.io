"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { StyledReveal } from "./PageReveal.styles";

type RevealedChildProps = { children: ReactNode };

/**
 * --vt-x/--vt-y are set globally, in viewport-absolute px, by a nav link's
 * onClick just before it navigates. This element sits below the persistent
 * header rather than covering the full viewport, so the clip-path's "at x
 * y" — resolved relative to THIS element's own box — needs that point
 * re-expressed in local coordinates before it reveals, or the circle would
 * open off-centre by exactly the header's height.
 */
const localiseOrigin = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  const root = getComputedStyle(document.documentElement);
  const localise = (axis: "x" | "y", offset: number) => {
    const raw = root.getPropertyValue(`--vt-${axis}`).trim();
    if (!raw.endsWith("px")) return raw; // percentage fallback: already box-relative
    return `${parseFloat(raw) - offset}px`;
  };
  el.style.setProperty("--vt-x", localise("x", rect.left));
  el.style.setProperty("--vt-y", localise("y", rect.top));
};

const RevealedChild = ({ children }: RevealedChildProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useLayoutEffect(() => {
    if (ref.current) localiseOrigin(ref.current);
    const frame = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <StyledReveal ref={ref} $revealed={revealed}>
      {children}
    </StyledReveal>
  );
};

/**
 * The whole site's page-to-page transition: keyed by pathname so it remounts
 * (and replays the reveal) on every route change, while the persistent
 * header around it never does.
 */
export const PageReveal = ({ children }: RevealedChildProps) => {
  const pathname = usePathname();
  return <RevealedChild key={pathname}>{children}</RevealedChild>;
};
