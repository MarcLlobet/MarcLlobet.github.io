import { describe, it, expect, beforeEach } from "vitest";
import {
  rememberScroll,
  prepareReturn,
  consumeReturnScroll,
} from "./returnNav";

describe("returnNav", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("round-trips a remembered scroll position through prepareReturn and consumeReturnScroll", () => {
    Object.defineProperty(window, "scrollY", {
      value: 420,
      configurable: true,
    });

    rememberScroll();

    expect(prepareReturn()).toBe(true);
    expect(consumeReturnScroll()).toBe(420);
  });

  it("prepareReturn returns false with nothing remembered", () => {
    expect(prepareReturn()).toBe(false);
  });

  it("consumeReturnScroll returns null without a pending restore", () => {
    expect(consumeReturnScroll()).toBeNull();
  });

  it("consumeReturnScroll only fires once", () => {
    Object.defineProperty(window, "scrollY", {
      value: 100,
      configurable: true,
    });

    rememberScroll();
    prepareReturn();

    expect(consumeReturnScroll()).toBe(100);
    expect(consumeReturnScroll()).toBeNull();
  });

  it("an ordinary visit to the home page never finds a pending restore left over from a remembered scroll that was never prepared", () => {
    Object.defineProperty(window, "scrollY", {
      value: 777,
      configurable: true,
    });

    rememberScroll(); // leaving home for a project
    // ...the project page is never opened via Back, just some other nav...

    expect(consumeReturnScroll()).toBeNull();
  });
});
