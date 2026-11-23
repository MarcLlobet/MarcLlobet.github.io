"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Dialog keyboard behaviour: Escape closes, Tab cycles only through the
 * focusable elements inside `ref`. Pass `active: false` for a dialog that
 * stays mounted while hidden (a portal faded out, not unmounted).
 */
export const useFocusTrap = (
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
  active = true,
) => {
  useEffect(() => {
    if (!active) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = ref.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [ref, onClose, active]);
};
