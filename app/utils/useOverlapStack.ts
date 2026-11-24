"use client";

import { useEffect } from "react";

/*
 * How long a section stays frozen before releasing, as a fraction of the
 * viewport — 1 means it engages the instant the next section's edge first
 * appears at the very bottom of the screen, so the whole climb (entering
 * at the bottom, sliding all the way up to fully cover) is visible, not
 * just the back half of it.
 */
const DWELL_RATIO = 1;

const STYLE_TAG_ID = "overlap-stack-styles";

/*
 * "above": hasn't reached the freeze threshold yet (or has scrolled back up
 * past it). "frozen": currently held in place. "past": already released
 * going downward — stays here (no transform, plain natural scroll) until
 * scrolling back up re-crosses the threshold, so it doesn't re-freeze every
 * subsequent tick just because its (by-then very negative) bottom still
 * satisfies "<= dwell".
 */
type Phase = "above" | "frozen" | "past";

type FreezeState = {
  phase: Phase;
  engageScrollY: number;
  dwell: number;
};

/**
 * Stacks a run of sections (in the order given) so each one, on reaching
 * the bottom of the viewport, stops moving — held in place with
 * transform: translateY, which cancels out further scroll without taking
 * the element out of flow (unlike position: fixed, which would shrink the
 * page's scrollable height the moment it engaged) — while the next section
 * keeps scrolling normally and visibly slides up over it, covering it,
 * before the frozen one releases.
 *
 * Reversible by construction: frozen state is re-derived from scrollY on
 * every scroll event, not a one-shot trigger, so scrolling back up plays
 * the same thing in reverse — the covering section slides back down,
 * uncovering the one underneath.
 *
 * Writes a single <style> tag straight into <head> rather than touching
 * each element's own style attribute or going through styled-components —
 * a separate, simple code path that can't be affected by anything in that
 * system, and trivial to inspect directly (document.getElementById(
 * "overlap-stack-styles").textContent) to confirm what's actually applied.
 */
export const useOverlapStack = (ids: string[]) => {
  const key = ids.join(",");

  useEffect(() => {
    const list = key.split(",").filter(Boolean);
    const sections = list
      .map((id) => ({ id, el: document.getElementById(id) }))
      .filter((s): s is { id: string; el: HTMLElement } => s.el !== null);
    if (sections.length === 0) return;

    let tag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;
    if (!tag) {
      tag = document.createElement("style");
      tag.id = STYLE_TAG_ID;
      document.head.appendChild(tag);
    }
    const styleTag = tag;

    /* Every section but the last one can freeze; the last has nothing
     * after it to be covered by. */
    const states: FreezeState[] = sections
      .slice(0, -1)
      .map(() => ({ phase: "above", engageScrollY: 0, dwell: 0 }));

    const render = () => {
      const rules = sections.map(({ id }, index) => {
        /* Every section but the first is a "covering" one — the border
         * marking its arrival is what reads as "a new section is rising"
         * against an otherwise identical black-on-black background. */
        const border =
          index === 0
            ? ""
            : "border-block-start: 1px solid var(--color-line-strong);";
        return `#${id} { position: relative; z-index: ${index + 1}; background: var(--color-bg); ${border} }`;
      });
      states.forEach((state, index) => {
        if (state.phase !== "frozen") return;
        const { id } = sections[index];
        const translateY = window.scrollY - state.engageScrollY;
        rules.push(`#${id} { transform: translateY(${translateY}px); }`);
      });
      styleTag.textContent = rules.join("\n");
    };

    let frame = 0;
    const tick = () => {
      frame = 0;
      let changed = false;
      sections.slice(0, -1).forEach(({ el }, index) => {
        const state = states[index];
        /* getBoundingClientRect reflects any transform currently applied,
         * so while frozen this reads back the pinned (not the natural)
         * position — only used in the "above"/"past" branches below,
         * where no transform is applied and it's the true, natural one. */
        const rect = el.getBoundingClientRect();
        const dwell = Math.round(window.innerHeight * DWELL_RATIO);

        if (state.phase === "above") {
          /* A zero-height rect means no real layout has happened (e.g. a
           * test environment) — never freeze off that. */
          if (rect.height > 0 && rect.bottom <= dwell) {
            state.phase = "frozen";
            state.engageScrollY = window.scrollY;
            state.dwell = dwell;
            changed = true;
          }
        } else if (state.phase === "frozen") {
          const traveled = window.scrollY - state.engageScrollY;
          if (traveled < 0) {
            state.phase = "above";
            changed = true;
          } else if (traveled >= state.dwell) {
            state.phase = "past";
            changed = true;
          } else {
            changed = true; // keep updating translateY while frozen
          }
        } else if (rect.bottom > dwell) {
          state.phase = "above";
          changed = true;
        }
      });
      if (changed) render();
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", tick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", tick);
      if (frame) cancelAnimationFrame(frame);
      styleTag.textContent = "";
    };
  }, [key]);
};
