import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { debounce, throttle } from "./schedule";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("waits for the calls to stop before running", () => {
    const fn = vi.fn();
    const scheduled = debounce(fn, 100);

    scheduled.run();
    vi.advanceTimersByTime(99);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("runs once for a burst of calls, with the last arguments", () => {
    const fn = vi.fn();
    const scheduled = debounce(fn, 100);

    scheduled.run("a");
    scheduled.run("b");
    scheduled.run("c");
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("c");
  });

  it("does not run after it is cancelled", () => {
    const fn = vi.fn();
    const scheduled = debounce(fn, 100);

    scheduled.run();
    scheduled.cancel();
    vi.advanceTimersByTime(1000);

    expect(fn).not.toHaveBeenCalled();
  });
});

describe("throttle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("runs straight away on the first call", () => {
    const fn = vi.fn();
    const scheduled = throttle(fn, 100);

    scheduled.run();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("runs once more at the end of the interval however many calls arrive", () => {
    const fn = vi.fn();
    const scheduled = throttle(fn, 50);

    for (let call = 0; call < 10; call += 1) {
      scheduled.run();
    }
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("passes the most recent arguments to the trailing call", () => {
    const fn = vi.fn();
    const scheduled = throttle(fn, 50);

    scheduled.run("first");
    scheduled.run("second");
    scheduled.run("third");
    vi.advanceTimersByTime(50);

    expect(fn).toHaveBeenNthCalledWith(1, "first");
    expect(fn).toHaveBeenNthCalledWith(2, "third");
  });

  it("runs straight away again once the interval has passed", () => {
    const fn = vi.fn();
    const scheduled = throttle(fn, 100);

    scheduled.run();
    vi.advanceTimersByTime(100);
    scheduled.run();

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("does not run the trailing call after it is cancelled", () => {
    const fn = vi.fn();
    const scheduled = throttle(fn, 100);

    scheduled.run();
    scheduled.run();
    scheduled.cancel();
    vi.advanceTimersByTime(1000);

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
