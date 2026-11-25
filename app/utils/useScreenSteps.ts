"use client";

import { useEffect } from "react";
import {
  SAME_SPOT_PX,
  hasModifier,
  isInteractiveTarget,
  isTypingTarget,
  nearestStop,
  stepTarget,
  stopAt,
  stopPositions,
} from "./screenSteps";

/** A scroll that ends this long after the last wheel event was a wheel gesture. */
const WHEEL_GESTURE_MS = 400;
/** Where scrollend isn't supported: a scroll is over after this much quiet. */
const SCROLL_QUIET_MS = 150;
/** A wheel gesture shorter than this share of a screen springs back. */
const SNAP_COMMIT_RATIO = 0.12;
/** Enter opens the project whose stop is within this share of a screen. */
const ENTER_REACH_RATIO = 0.25;

const STEP_ATTR = "data-step";
const ADDED_TABINDEX_ATTR = "data-step-tabindex";

/**
 * Screen-by-screen navigation for the home page, mostly for the keyboard:
 *
 * - ↓ / ↑ go to the next / previous screen of `ids` (hero, each project,
 *   then the sections after them), one viewport at a time inside anything
 *   taller than the screen. Focus follows, so Tab carries on from there and
 *   a screen reader announces the section.
 * - Enter, on a project's screen, opens that project (the same link the
 *   frame is, so the page transition grows from the frame).
 * - With a mouse or trackpad, the first `snapCount` screens (hero and the
 *   projects) plus the one after them snap: a wheel gesture ends on a
 *   screen, never halfway between two.
 *
 * The snap is done here rather than with CSS scroll-snap on purpose:
 * useOverlapStack pins sections with transform: translateY while the next
 * one covers them, and a scroll-snap area follows its transform — a pinned
 * section would drag its own snap point along with the scroll and trap it.
 * These stops come from offsetTop instead, which transforms never move.
 */
export const useScreenSteps = (ids: string[], snapCount: number) => {
  const key = ids.join(",");

  useEffect(() => {
    const elements = key
      .split(",")
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    /* Focusable from script only (tabindex=-1): never an extra Tab stop. */
    elements.forEach((el) => {
      el.setAttribute(STEP_ATTR, "");
      if (!el.hasAttribute("tabindex")) {
        el.setAttribute("tabindex", "-1");
        el.setAttribute(ADDED_TABINDEX_ATTR, "");
      }
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    const headerHeight = () =>
      document.querySelector<HTMLElement>("body header")?.offsetHeight ?? 0;
    const screen = () => window.innerHeight - headerHeight();
    const stops = () =>
      stopPositions(
        elements,
        headerHeight(),
        document.documentElement.scrollHeight - window.innerHeight,
      );

    /* The scroll this hook started, if it's still on its way. */
    let pending: { top: number; fromKeys: boolean } | null = null;
    /*
     * Where the page last came to rest. A wheel gesture is measured from
     * here: by the time a wheel event is handled the browser may already
     * have scrolled for it, so scrollY at that moment isn't the start.
     */
    let restY = window.scrollY;
    let wheeling = false;
    let lastWheel = -Infinity;

    const focusStopAt = (y: number) => {
      const index = stopAt(stops(), y);
      if (index !== -1) elements[index].focus({ preventScroll: true });
    };

    const go = (top: number, fromKeys: boolean) => {
      if (Math.abs(window.scrollY - top) < 1) {
        pending = null;
        if (fromKeys) focusStopAt(top);
        return;
      }
      pending = { top, fromKeys };
      window.scrollTo({
        top,
        behavior: reducedMotion.matches ? "instant" : "smooth",
      });
    };

    /* The wheel gesture is over: land on a screen. */
    const snap = (start: number) => {
      const all = stops();
      /* Hero, every project and the screen right after the last one. */
      const zone = all.slice(0, snapCount + 1);
      const y = window.scrollY;
      if (zone.length < 2 || y > zone[zone.length - 1] + SAME_SPOT_PX) return;

      const travelled = y - start;
      let index = nearestStop(zone, y);
      /* A deliberate flick always moves on, even if it stopped short of halfway. */
      if (Math.abs(travelled) > screen() * SNAP_COMMIT_RATIO) {
        const forward = travelled > 0;
        const beyond = zone.findIndex((stop) =>
          forward ? stop > start + SAME_SPOT_PX : stop >= start - SAME_SPOT_PX,
        );
        if (forward && zone[index] <= start + SAME_SPOT_PX && beyond !== -1) {
          index = beyond;
        } else if (!forward && zone[index] >= start - SAME_SPOT_PX) {
          /* The last stop above where the gesture started. */
          index = beyond === -1 ? zone.length - 1 : Math.max(0, beyond - 1);
        }
      }
      if (Math.abs(zone[index] - y) > SAME_SPOT_PX) go(zone[index], false);
    };

    const settle = () => {
      if (pending) {
        const { fromKeys } = pending;
        pending = null;
        restY = window.scrollY;
        if (fromKeys) focusStopAt(window.scrollY);
        return;
      }
      const start = restY;
      const fromWheel =
        wheeling && performance.now() - lastWheel <= WHEEL_GESTURE_MS;
      wheeling = false;
      restY = window.scrollY;
      if (fromWheel && finePointer.matches) snap(start);
    };

    const onWheel = () => {
      /* The user took over: whatever this hook was scrolling to is cancelled. */
      if (pending) {
        pending = null;
        restY = window.scrollY;
      }
      wheeling = true;
      lastWheel = performance.now();
    };

    const hasScrollEnd = "onscrollend" in window;
    let quiet = 0;
    const onScroll = () => {
      window.clearTimeout(quiet);
      quiet = window.setTimeout(settle, SCROLL_QUIET_MS);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        hasModifier(event) ||
        isTypingTarget(event.target)
      )
        return;

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const from = pending?.top ?? window.scrollY;
        const direction = event.key === "ArrowDown" ? 1 : -1;
        const target = stepTarget(stops(), from, direction, screen());
        if (target !== from) go(target, true);
        return;
      }

      if (event.key === "Enter" && !isInteractiveTarget(event.target)) {
        const all = stops();
        const y = pending?.top ?? window.scrollY;
        const index = nearestStop(all, y);
        if (Math.abs(all[index] - y) > screen() * ENTER_REACH_RATIO) return;
        const frame =
          elements[index].querySelector<HTMLElement>("[data-frame]");
        if (!frame) return;
        event.preventDefault();
        frame.click();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onWheel, { passive: true });
    if (hasScrollEnd) window.addEventListener("scrollend", settle);
    else window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scrollend", settle);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(quiet);
      elements.forEach((el) => {
        el.removeAttribute(STEP_ATTR);
        if (el.hasAttribute(ADDED_TABINDEX_ATTR)) {
          el.removeAttribute("tabindex");
          el.removeAttribute(ADDED_TABINDEX_ATTR);
        }
      });
    };
  }, [key, snapCount]);
};
