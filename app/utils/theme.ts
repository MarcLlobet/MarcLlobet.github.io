"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "theme";
const LIGHT_CLASS = "light-theme";

/** How long the theme-reveal keyframe (GlobalStyles) takes to sweep across. */
export const THEME_REVEAL_MS = 1100;

export const isLightTheme = () =>
  document.documentElement.classList.contains(LIGHT_CLASS);

/** The visitor's stored choice, or dark — the site's default — where nothing's been chosen yet. */
export const preferredTheme = (): "light" | "dark" => {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" ? "light" : "dark";
};

/** Applies the stored/system theme; call once, as early as possible, to avoid a flash. */
export const applyPreferredTheme = () => {
  document.documentElement.classList.toggle(
    LIGHT_CLASS,
    preferredTheme() === "light",
  );
};

/**
 * Toggles the theme and remembers the choice, so it survives reloads and
 * other pages. Where the View Transitions API is available, the swap plays
 * inside one, so the diagonal sweep declared in GlobalStyles can animate it;
 * elsewhere it's just the instant class flip.
 */
export const toggleTheme = () => {
  const next = !isLightTheme();
  const apply = () => {
    document.documentElement.classList.toggle(LIGHT_CLASS, next);
    window.localStorage.setItem(STORAGE_KEY, next ? "light" : "dark");
  };

  if (!document.startViewTransition) {
    apply();
    return;
  }
  document.startViewTransition(apply);
};

/** Notifies `onChange` whenever the theme class changes, from anywhere. */
export const subscribeToTheme = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
};

/** The current theme, reactively — stays in sync with a toggle from anywhere. */
export const useIsLightTheme = () =>
  useSyncExternalStore(subscribeToTheme, isLightTheme, () => false);
