"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "theme";
const LIGHT_CLASS = "light-theme";

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

/** Toggles the theme and remembers the choice, so it survives reloads and other pages. */
export const toggleTheme = () => {
  const next = !isLightTheme();
  document.documentElement.classList.toggle(LIGHT_CLASS, next);
  window.localStorage.setItem(STORAGE_KEY, next ? "light" : "dark");
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
