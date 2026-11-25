import { describe, expect, it } from "vitest";
import { fallbackFor } from "./useBackKey";

describe("fallbackFor", () => {
  it("sends a project page back to that project's screen on the home page", () => {
    expect(fallbackFor("/projects/pis-stop")).toBe("/#pis-stop");
    expect(fallbackFor("/projects/pis-stop/")).toBe("/#pis-stop");
  });

  it("sends any other page to the home page", () => {
    expect(fallbackFor("/design")).toBe("/");
  });
});
