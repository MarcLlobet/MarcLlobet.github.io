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

describe("buildMockup filling its box", () => {
  /* Desktop frame, laptop, tablet, phone and a short landscape one */
  const BOXES = [
    [1200, 600],
    [840, 470],
    [560, 420],
    [330, 400],
    [840, 200],
  ];
  /* The page margin the mockup keeps around its content, as in buildMockup */
  const margin = (w: number) => Math.max(12, Math.min(48, (w * 3.5) / 100));

  it.each(MOCKUP_KINDS)("draws %s out to the edges of the box", (kind) => {
    for (const [w, h] of BOXES) {
      let bottom = 0;
      let right = 0;
      for (const shape of buildMockup(kind, w, h)) {
        if (shape.type === "circle") {
          bottom = Math.max(bottom, shape.cy + shape.r);
          right = Math.max(right, shape.cx + shape.r);
          continue;
        }
        /* The page background is not content */
        if (shape.type !== "rect" || (shape.w >= w && shape.h >= h)) continue;
        bottom = Math.max(bottom, shape.y + shape.h);
        right = Math.max(right, shape.x + shape.w);
      }
      expect(bottom).toBeGreaterThan(h - margin(w) * 2);
      expect(right).toBeGreaterThan(w - margin(w) * 2);
    }
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

describe("buildMockup at any aspect ratio", () => {
  const SHAPES = [
    [1600, 240],
    [900, 900],
    [360, 640],
    [240, 900],
  ];

  it.each(MOCKUP_KINDS)(
    "keeps every %s shape inside wide, square and tall boxes",
    (kind) => {
      for (const [w, h] of SHAPES) {
        for (const shape of buildMockup(kind, w, h)) {
          if (shape.type === "rect") {
            expect(shape.x + shape.w).toBeLessThanOrEqual(w + 0.5);
            expect(shape.y + shape.h).toBeLessThanOrEqual(h + 0.5);
          }
        }
      }
    },
  );

  it("lays a wide box out in more columns than a tall one", () => {
    const columns = (w: number, h: number) =>
      new Set(
        buildMockup("matrix", w, h)
          .filter((s) => s.type === "rect" && s.fill === "acc")
          .map((s) => (s.type === "rect" ? Math.round(s.x) : 0)),
      ).size;
    expect(columns(1600, 240)).toBeGreaterThan(columns(240, 900));
  });
});
