"use client";

import { useSyncExternalStore } from "react";
import { copy as coreCopy, type CopyKey } from "../content/copy";

export type { CopyKey };

type CopyValue = string | string[];
type CoreCopy = typeof coreCopy;

let dictionary: Record<string, CopyValue> = { ...coreCopy };
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

/**
 * Merges a lazily-loaded slice of copy into the shared dictionary. Call it
 * from a lazy-loaded module's own top level, alongside its own
 * copy.<scope>.json import, so those strings ship in that chunk instead of
 * the main one and reach useCopy's consumers the moment it loads.
 */
export const registerCopy = (slice: Record<string, CopyValue>) => {
  dictionary = { ...dictionary, ...slice };
  notify();
};

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
};

const getSnapshot = () => dictionary;

/**
 * The one way a client component reads copy: const { t } = useCopy();
 * t("home.skipToContent"). Every key is inferred from copy.json, so a typo
 * or a key that doesn't exist is a type error, not a silent empty string —
 * and the return type matches that key's own shape (string or string[]).
 */
export const useCopy = () => {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const t = <K extends CopyKey>(key: K): CoreCopy[K] =>
    snapshot[key] as CoreCopy[K];
  return { t };
};
