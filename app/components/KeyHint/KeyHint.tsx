"use client";

import type { ReactNode } from "react";
import { Cap, Hint, Label } from "./KeyHint.styles";

type KeyProps = {
  /** What's printed on the cap: an arrow, ↵, ⌫… */
  glyph: string;
  /** The key's name, for screen readers ("Enter", not "↵"). */
  label: string;
};

/** One key cap. */
export const Key = ({ glyph, label }: KeyProps) => (
  <Cap>
    <span aria-hidden="true">{glyph}</span>
    <Label>{label}</Label>
  </Cap>
);

/** A keyboard hint, shown on a desktop only. */
export const KeyHint = ({ children }: { children: ReactNode }) => (
  <Hint>{children}</Hint>
);
