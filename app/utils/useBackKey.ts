"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { setTransitionOrigin } from "./pageTransition";
import { hasModifier, isTypingTarget } from "./screenSteps";

const HOME = "/";
const PROJECT_PATH = /^\/projects\/([^/]+)\/?$/;

/**
 * Where Backspace leads when there's no in-site page to go back to (someone
 * landed straight on a project from a shared link): home, on that project's
 * own screen.
 */
export const fallbackFor = (pathname: string): string => {
  const project = PROJECT_PATH.exec(pathname);
  return project ? `/#${project[1]}` : HOME;
};

/**
 * Backspace goes back, like a browser's own back button, on every page but
 * the home page — as long as nobody is typing in a field. Lives in the
 * layout, which never remounts, so it can count how many history entries
 * behind this one are part of this site (forward navigations add one, the
 * back button or this key take one away). With one behind it, it's a real
 * history.back() (the home page comes back where it was left); with none,
 * it opens the home page instead of leaving the site.
 */
export const useBackKey = () => {
  const pathname = usePathname();
  const router = useRouter();
  const previousPath = useRef(pathname);
  /* How many in-site pages sit behind this one in the history stack. */
  const depth = useRef(0);
  const cameBack = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      cameBack.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (pathname === previousPath.current) return;
    previousPath.current = pathname;
    depth.current = Math.max(0, depth.current + (cameBack.current ? -1 : 1));
    cameBack.current = false;
  }, [pathname]);

  useEffect(() => {
    if (pathname === HOME) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== "Backspace" ||
        event.defaultPrevented ||
        hasModifier(event) ||
        isTypingTarget(event.target)
      )
        return;
      event.preventDefault();
      setTransitionOrigin(null);
      if (depth.current > 0) router.back();
      else router.push(fallbackFor(pathname));
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pathname, router]);
};
