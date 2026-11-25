import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useActiveSection } from "./useActiveSection";

type FakeEntry = { target: Element; isIntersecting: boolean };

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  callback: IntersectionObserverCallback;
  observed: Element[] = [];

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    FakeIntersectionObserver.instances.push(this);
  }
  observe(element: Element) {
    this.observed.push(element);
  }
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  trigger(entries: FakeEntry[]) {
    this.callback(
      entries as IntersectionObserverEntry[],
      this as unknown as IntersectionObserver,
    );
  }
}

const makeSection = (id: string) => {
  const el = document.createElement("div");
  el.id = id;
  document.body.appendChild(el);
  return el;
};

describe("useActiveSection", () => {
  beforeEach(() => {
    FakeIntersectionObserver.instances = [];
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  it("starts with nothing active", () => {
    makeSection("a");
    const { result } = renderHook(() => useActiveSection(["a"]));
    expect(result.current).toBeNull();
  });

  it("tracks whichever observed section is intersecting", async () => {
    const a = makeSection("a");
    const b = makeSection("b");

    const { result } = renderHook(() => useActiveSection(["a", "b"]));
    const observer = FakeIntersectionObserver.instances[0];

    observer.trigger([{ target: a, isIntersecting: true }]);
    await waitFor(() => expect(result.current).toBe("a"));

    observer.trigger([
      { target: a, isIntersecting: false },
      { target: b, isIntersecting: true },
    ]);
    await waitFor(() => expect(result.current).toBe("b"));
  });

  it("clears once nothing is intersecting (back at the top)", async () => {
    const a = makeSection("a");
    const { result } = renderHook(() => useActiveSection(["a"]));
    const observer = FakeIntersectionObserver.instances[0];

    observer.trigger([{ target: a, isIntersecting: true }]);
    await waitFor(() => expect(result.current).toBe("a"));

    observer.trigger([{ target: a, isIntersecting: false }]);
    await waitFor(() => expect(result.current).toBeNull());
  });

  it("does nothing when none of the ids exist in the document", () => {
    const { result } = renderHook(() => useActiveSection(["missing"]));
    expect(FakeIntersectionObserver.instances).toHaveLength(0);
    expect(result.current).toBeNull();
  });
});
