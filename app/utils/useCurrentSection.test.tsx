import { renderHook, act } from "@testing-library/react";
import { useCurrentSection } from "./useCurrentSection";
import * as throttle from "./throttle";
import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import { mockRepos } from "../mocks/repos";

describe("useCurrentSection", () => {
  let originalInnerHeight: number;

  beforeEach(() => {
    // Clean up DOM
    document.body.innerHTML = "";
    // Mock throttle to call immediately
    vi.spyOn(throttle, "throttle").mockImplementation((fn) => fn);
    // Fix window.innerHeight for predictable tests
    originalInnerHeight = window.innerHeight;
    Object.defineProperty(window, "innerHeight", { value: 0, writable: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Restore window.innerHeight
    Object.defineProperty(window, "innerHeight", {
      value: originalInnerHeight,
      writable: true,
    });
  });

  it("returns null if no sections", () => {
    const { result } = renderHook(() => useCurrentSection([]));
    expect(result.current).toBe(null);
  });

  it("returns the section in viewport on scroll", () => {
    // Create fake sections
    const section1 = document.createElement("div");
    section1.className = "page-section";
    section1.id = "repo1";
    Object.defineProperty(section1, "offsetTop", { value: 0 });
    document.body.appendChild(section1);

    const section2 = document.createElement("div");
    section2.className = "page-section";
    section2.id = "repo2";
    Object.defineProperty(section2, "offsetTop", { value: 200 });
    document.body.appendChild(section2);

    const { result } = renderHook(() => useCurrentSection(mockRepos));

    // Simulate scrollY at 0 (first section)
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe("repo1");

    // Simulate scrollY at 250 (second section)
    Object.defineProperty(window, "scrollY", { value: 250, writable: true });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe("repo2");
  });
});
