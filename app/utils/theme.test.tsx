import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import {
  applyPreferredTheme,
  isLightTheme,
  preferredTheme,
  toggleTheme,
  useIsLightTheme,
} from "./theme";

describe("theme", () => {
  afterEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("light-theme");
    vi.unstubAllGlobals();
  });

  it("defaults to dark when nothing is stored, regardless of the system preference", () => {
    vi.stubGlobal(
      "matchMedia",
      vi
        .fn()
        .mockReturnValue({ matches: true }) as unknown as typeof matchMedia,
    );
    expect(preferredTheme()).toBe("dark");
  });

  it("honours a stored choice", () => {
    window.localStorage.setItem("theme", "light");
    expect(preferredTheme()).toBe("light");

    window.localStorage.setItem("theme", "dark");
    expect(preferredTheme()).toBe("dark");
  });

  it("applies the preferred theme to the document", () => {
    window.localStorage.setItem("theme", "light");
    applyPreferredTheme();
    expect(isLightTheme()).toBe(true);
  });

  it("toggles the theme and remembers the choice", () => {
    expect(isLightTheme()).toBe(false);

    toggleTheme();
    expect(isLightTheme()).toBe(true);
    expect(window.localStorage.getItem("theme")).toBe("light");

    toggleTheme();
    expect(isLightTheme()).toBe(false);
    expect(window.localStorage.getItem("theme")).toBe("dark");
  });

  it("useIsLightTheme reacts to a toggle from anywhere", async () => {
    const { result } = renderHook(() => useIsLightTheme());
    expect(result.current).toBe(false);

    toggleTheme();

    await waitFor(() => expect(result.current).toBe(true));
  });
});
