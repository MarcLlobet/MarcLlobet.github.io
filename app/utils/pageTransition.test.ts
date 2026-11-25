import { describe, it, expect, afterEach, vi } from "vitest";
import {
  setTransitionOrigin,
  requestPageExit,
  PAGE_EXIT_EVENT,
  REVEAL_MS,
} from "./pageTransition";

const rect = (overrides: Partial<DOMRect>): DOMRect => ({
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  toJSON: () => "",
  ...overrides,
});

describe("setTransitionOrigin", () => {
  afterEach(() => {
    document.documentElement.style.cssText = "";
  });

  it("sets --vt-x/--vt-y to the anchor's centre", () => {
    const anchor = document.createElement("button");
    anchor.getBoundingClientRect = () =>
      rect({ left: 10, top: 20, width: 30, height: 40 });

    setTransitionOrigin(anchor);

    const style = document.documentElement.style;
    expect(style.getPropertyValue("--vt-x")).toBe("25px");
    expect(style.getPropertyValue("--vt-y")).toBe("40px");
  });

  it("falls back to the top-right corner without an anchor", () => {
    setTransitionOrigin(null);

    const style = document.documentElement.style;
    expect(style.getPropertyValue("--vt-x")).toBe(`${window.innerWidth}px`);
    expect(style.getPropertyValue("--vt-y")).toBe("0px");
  });
});

describe("requestPageExit", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("dispatches PAGE_EXIT_EVENT immediately, for PageReveal to collapse on", () => {
    const listener = vi.fn();
    window.addEventListener(PAGE_EXIT_EVENT, listener);
    void requestPageExit();
    window.removeEventListener(PAGE_EXIT_EVENT, listener);

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("resolves only once the collapse transition has finished", async () => {
    vi.useFakeTimers();
    let resolved = false;
    requestPageExit().then(() => {
      resolved = true;
    });

    await vi.advanceTimersByTimeAsync(REVEAL_MS - 1);
    expect(resolved).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    expect(resolved).toBe(true);
  });

  it("resolves immediately for a reduced-motion preference, instead of waiting out a transition that isn't playing", async () => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query.includes("reduce"),
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }));

    await expect(requestPageExit()).resolves.toBeUndefined();
  });
});
