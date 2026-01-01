import { describe, it, expect, vi, beforeEach } from "vitest";
import { throttle } from "./throttle";

describe("throttle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should call the function immediately and then throttle subsequent calls", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);
    throttled(); // should call immediately
    throttled(); // should be throttled
    expect(fn).toHaveBeenCalledTimes(1);
    // Advance time by 100ms
    vi.advanceTimersByTime(100);
    throttled(); // should call again
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should only call once if called rapidly", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 50);
    for (let i = 0; i < 10; i++) {
      throttled();
    }
    expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
