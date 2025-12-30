import { renderHook, act } from "@testing-library/react";
import { useCurrentSection } from "./useCurrentSection";
import * as throttle from "./throttle";
import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import { mockRepos } from "../mocks/repos";

describe("useCurrentSection", () => {
  beforeEach(() => {
    // Clean up DOM
    document.body.innerHTML = "";
    vi.isFakeTimers();
    // Mock throttle to call immediately
    vi.spyOn(throttle, "throttle").mockImplementation((fn) => fn);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  let originalInnerHeight: number;
  beforeEach(() => {
    // Clean up DOM
    document.body.innerHTML = "";
    // Mock throttle to call immediately
    vi.spyOn(throttle, "throttle").mockImplementation((fn) => fn);
    // Fixa window.innerHeight per a tests predictibles
    originalInnerHeight = window.innerHeight;
    Object.defineProperty(window, "innerHeight", { value: 0, writable: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Restaura window.innerHeight
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
    section1.getBoundingClientRect = () => ({
      top: 0,
      bottom: 100,
      left: 0,
      right: 0,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
    document.body.appendChild(section1);
    const section2 = document.createElement("div");
    section2.className = "page-section";
    section2.id = "repo2";
    section2.getBoundingClientRect = () => ({
      top: 200,
      bottom: 300,
      left: 0,
      right: 0,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
    document.body.appendChild(section2);

    const { result } = renderHook(() => useCurrentSection(mockRepos.data));

    // Simula scrollY a 0 (primer section)
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe("repo1");

    // Simula scrollY a 250 (segon section)
    Object.defineProperty(window, "scrollY", { value: 250, writable: true });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe("repo2");
  });
});
