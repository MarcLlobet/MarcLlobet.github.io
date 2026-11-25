import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useScreenSteps } from "./useScreenSteps";

const { startScreenSteps } = vi.hoisted(() => ({
  startScreenSteps: vi.fn(() => () => {}),
}));
vi.mock("./screenStepsRuntime", () => ({ startScreenSteps }));

const setDesktop = (desktop: boolean) =>
  vi
    .spyOn(window, "matchMedia")
    .mockReturnValue({ matches: desktop } as MediaQueryList);

const press = (key: string) => {
  const event = new KeyboardEvent("keydown", { key, cancelable: true });
  window.dispatchEvent(event);
  return event;
};

describe("useScreenSteps", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    startScreenSteps.mockClear();
  });

  it("never loads the keyboard navigation on a touch device", async () => {
    window.matchMedia ??= (() => ({}) as MediaQueryList) as typeof matchMedia;
    setDesktop(false);
    renderHook(() => useScreenSteps(["hero", "one"], 2));
    press("ArrowDown");
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(startScreenSteps).not.toHaveBeenCalled();
  });

  it("loads it on a desktop at the first key, and hands that key over", async () => {
    window.matchMedia ??= (() => ({}) as MediaQueryList) as typeof matchMedia;
    setDesktop(true);
    renderHook(() => useScreenSteps(["hero", "one"], 2));
    expect(startScreenSteps).not.toHaveBeenCalled();

    const event = press("ArrowDown");
    /* The arrow's own scroll is held back while the module loads. */
    expect(event.defaultPrevented).toBe(true);
    await waitFor(() => expect(startScreenSteps).toHaveBeenCalledTimes(1));
    expect(startScreenSteps).toHaveBeenCalledWith(["hero", "one"], 2, {
      event,
      restY: 0,
    });

    press("ArrowDown");
    expect(startScreenSteps).toHaveBeenCalledTimes(1);
  });

  it("leaves a key alone while typing", () => {
    window.matchMedia ??= (() => ({}) as MediaQueryList) as typeof matchMedia;
    setDesktop(true);
    renderHook(() => useScreenSteps(["hero"], 1));
    const input = document.createElement("input");
    document.body.append(input);
    const event = new KeyboardEvent("keydown", {
      key: "ArrowDown",
      cancelable: true,
      bubbles: true,
    });
    input.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    input.remove();
  });
});
