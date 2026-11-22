import { describe, it, expect, afterEach } from "vitest";
import { setTransitionOrigin } from "./pageTransition";

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
