import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSectionHash } from "./useSectionHash";

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

describe("useSectionHash", () => {
  beforeEach(() => {
    FakeIntersectionObserver.instances = [];
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    window.history.replaceState(null, "", "/");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  it("sets the hash to whichever observed section is intersecting", () => {
    const a = makeSection("a");
    const b = makeSection("b");

    renderHook(() => useSectionHash(["a", "b"]));
    const observer = FakeIntersectionObserver.instances[0];

    observer.trigger([{ target: a, isIntersecting: true }]);
    expect(window.location.hash).toBe("#a");

    observer.trigger([
      { target: a, isIntersecting: false },
      { target: b, isIntersecting: true },
    ]);
    expect(window.location.hash).toBe("#b");
  });

  it("clears the hash once nothing is intersecting (back at the top)", () => {
    const a = makeSection("a");
    renderHook(() => useSectionHash(["a"]));
    const observer = FakeIntersectionObserver.instances[0];

    observer.trigger([{ target: a, isIntersecting: true }]);
    expect(window.location.hash).toBe("#a");

    observer.trigger([{ target: a, isIntersecting: false }]);
    expect(window.location.hash).toBe("");
  });

  it("never touches the address bar away from the home page", () => {
    const a = makeSection("a");
    window.history.replaceState(null, "", "/about");

    renderHook(() => useSectionHash(["a"]));
    const observer = FakeIntersectionObserver.instances[0];
    observer.trigger([{ target: a, isIntersecting: true }]);

    expect(window.location.pathname).toBe("/about");
    expect(window.location.hash).toBe("");
  });

  it("does nothing when none of the ids exist in the document", () => {
    renderHook(() => useSectionHash(["missing"]));
    expect(FakeIntersectionObserver.instances).toHaveLength(0);
  });
});
