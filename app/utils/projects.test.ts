import { describe, expect, it } from "vitest";
import { mockRepos } from "../mocks/repos";
import {
  accentFor,
  ACCENTS,
  displayName,
  firstSentence,
  selectProjects,
  splitDescription,
  unmatchedPins,
  visibleLanguages,
} from "./projects";
import type { Repository } from "../types";

const repo = (name: string): Repository => ({
  ...mockRepos[0],
  id: name,
  name,
});

describe("splitDescription", () => {
  it("splits the tagline from the detail at the first em dash", () => {
    expect(
      splitDescription(
        "A phone store built to feel effortless — instant search — and more.",
      ),
    ).toEqual({
      tagline: "A phone store built to feel effortless",
      detail: "Instant search — and more.",
    });
  });

  it("accepts an en dash", () => {
    expect(splitDescription("Tagline – detail").tagline).toBe("Tagline");
  });

  it("falls back to the first sentence when there is no dash", () => {
    expect(
      splitDescription(
        "Satellite data on a map. Built on Leaflet, with a tiny tile cache.",
      ),
    ).toEqual({
      tagline: "Satellite data on a map.",
      detail: "Built on Leaflet, with a tiny tile cache.",
    });
  });

  it("prefers the dash over the first sentence", () => {
    expect(
      splitDescription("A store that feels effortless — fast. Really fast."),
    ).toEqual({
      tagline: "A store that feels effortless",
      detail: "Fast. Really fast.",
    });
  });

  it("does not split a sentence mid-abbreviation", () => {
    expect(splitDescription("Built with Next.js and Node.js")).toEqual({
      tagline: "Built with Next.js and Node.js",
      detail: "",
    });
  });

  it("keeps a single sentence whole", () => {
    expect(splitDescription("Satellite data on a map.")).toEqual({
      tagline: "Satellite data on a map.",
      detail: "",
    });
  });

  it("keeps the whole text as the tagline without a separator", () => {
    expect(splitDescription("Satellite data on a map")).toEqual({
      tagline: "Satellite data on a map",
      detail: "",
    });
  });

  it("does not split hyphenated words", () => {
    expect(splitDescription("TypeScript-only CLI").detail).toBe("");
  });
});

describe("firstSentence", () => {
  it("stops at the first full stop", () => {
    expect(firstSentence("One thing. And another. And more.")).toBe(
      "One thing.",
    );
  });

  it("keeps a single sentence, abbreviations and all", () => {
    expect(firstSentence("Apps with HTML, SVG and Next.js")).toBe(
      "Apps with HTML, SVG and Next.js",
    );
  });
});

describe("visibleLanguages", () => {
  it("puts the primary language first and drops tooling noise", () => {
    expect(
      visibleLanguages({
        ...mockRepos[0],
        primaryLanguage: { name: "TypeScript" },
        languages: [{ name: "Bru" }, { name: "CSS" }, { name: "TypeScript" }],
      }),
    ).toEqual(["TypeScript", "CSS"]);
  });
});

describe("selectProjects", () => {
  const repos = ["a", "b", "c", "d", "e", "f", "g", "h"].map(repo);

  it("features pinned repositories in pin order", () => {
    const { featured, archive } = selectProjects(repos, ["c", "missing", "a"]);
    expect(featured.map(({ name }) => name)).toEqual(["c", "a"]);
    expect(archive.map(({ name }) => name)).toEqual([
      "b",
      "d",
      "e",
      "f",
      "g",
      "h",
    ]);
  });

  it("features nothing without pins", () => {
    const { featured, archive } = selectProjects(repos, []);
    expect(featured).toHaveLength(0);
    expect(archive).toHaveLength(repos.length);
  });

  it("matches pins by the exact git name", () => {
    const { featured } = selectProjects(repos, ["A", "a "]);
    expect(featured).toHaveLength(0);
  });
});

describe("unmatchedPins", () => {
  it("lists pins without the demo topic", () => {
    expect(unmatchedPins([repo("a")], ["a", "dotfiles"])).toEqual(["dotfiles"]);
  });
});

describe("helpers", () => {
  it("cycles the accents", () => {
    expect(accentFor(ACCENTS.length)).toBe(`var(${ACCENTS[0]})`);
  });

  it("turns slugs into words", () => {
    expect(displayName("mobile-store")).toBe("mobile store");
  });
});
