"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { PAGE_EXIT_EVENT, REVEAL_MS } from "../../utils/pageTransition";
import { prefersReducedMotion } from "../../utils/useMediaQuery";
import { StyledReveal, type RevealPhase } from "./PageReveal.styles";

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
  const [phase, setPhase] = useState<RevealPhase>("hidden");

  useLayoutEffect(() => {
    if (ref.current) localiseOrigin(ref.current);
    const frame = requestAnimationFrame(() => setPhase("revealing"));
    return () => cancelAnimationFrame(frame);
  }, []);

  /* Once the grow has actually finished, drop the clip-path rather than
   * leave a (finite, vmax-sized) circle sitting there — see PageReveal
   * .styles for why a page taller than that circle needs this. Under
   * reduced motion the transition itself is forced to ~0 (GlobalStyles),
   * so this settles on the next tick instead of still waiting out the
   * full REVEAL_MS with a circle that, while already visually complete,
   * would otherwise still clip a tall page for that whole stretch. */
  useEffect(() => {
    if (phase !== "revealing") return;
    const timeout = setTimeout(
      () => setPhase("settled"),
      prefersReducedMotion() ? 0 : REVEAL_MS,
    );
    return () => clearTimeout(timeout);
  }, [phase]);

  /* requestPageExit (pageTransition.ts) dispatches this just before a
   * "back" action navigates away, so this page's own reveal collapses
   * first instead of just vanishing when the route changes. Settled
   * ("none") has no circle to shrink from, so this first snaps back to
   * the equivalent full-size circle (same visual, no transition plays
   * between the two — browsers don't interpolate clip-path's "none" with
   * a shape anyway) before actually animating it down on the next frame. */
  useEffect(() => {
    const onExit = () => {
      setPhase("revealing");
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setPhase("hidden")),
      );
    };
    window.addEventListener(PAGE_EXIT_EVENT, onExit);
    return () => window.removeEventListener(PAGE_EXIT_EVENT, onExit);
  }, []);

  return (
    <StyledReveal ref={ref} $phase={phase}>
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
