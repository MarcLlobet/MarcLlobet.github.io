import { describe, expect, it } from "vitest";
import { mockRepos } from "../mocks/repos";
import { buildMockup, MOCKUP_KINDS, mockupFor } from ".";

const SIZES = [
  [1200, 600],
  [800, 400],
  [320, 160],
  [140, 70],
];

describe("buildMockup", () => {
  it.each(MOCKUP_KINDS)("keeps every %s shape inside its box", (kind) => {
    for (const [w, h] of SIZES) {
      for (const shape of buildMockup(kind, w, h)) {
        if (shape.type === "rect") {
          expect(shape.x).toBeGreaterThanOrEqual(-0.5);
          expect(shape.y).toBeGreaterThanOrEqual(-0.5);
          expect(shape.x + shape.w).toBeLessThanOrEqual(w + 0.5);
          expect(shape.y + shape.h).toBeLessThanOrEqual(h + 0.5);
        }
      }
    }
  });

  it("recounts the layout for the size of the box", () => {
    const wide = buildMockup("store", 1200, 600).length;
    const narrow = buildMockup("store", 320, 160).length;
    expect(wide).toBeGreaterThan(narrow);
  });
});

describe("mockupFor", () => {
  it("uses the project's own mockup", () => {
    expect(mockupFor({ ...mockRepos[0], name: "gryphon" })).toBe("map");
  });

  it("reads a mockup-<kind> topic", () => {
    expect(
      mockupFor({
        ...mockRepos[0],
        name: "new-thing",
        topics: ["demo", "mockup-graph"],
      }),
    ).toBe("graph");
  });

  it("always picks a kind for an unknown project", () => {
    expect(MOCKUP_KINDS).toContain(mockupFor({ ...mockRepos[0], name: "zzz" }));
  });
});
