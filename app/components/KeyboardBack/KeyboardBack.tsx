"use client";

import { useBackKey } from "../../utils/useBackKey";

/** Renders nothing: it only listens for Backspace (see useBackKey). */
export const KeyboardBack = () => {
  useBackKey();
  return null;
};
