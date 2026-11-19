import { describe, it, expect } from "vitest";
import { buildSearchTree, getSearchResults, getWords } from ".";
import { repositoryText } from "./repositories";
import { mockRepos } from "../../mocks";
import type { Repository } from "../../types";

const repo = (
  name: string,
  overrides: Partial<Repository> = {},
): Repository => ({
  ...mockRepos[0]!,
  id: name,
  name,
  description: "",
  topics: ["demo"],
  languages: [],
  ...overrides,
});

const imageGallery = repo("image-gallery", {
  description: "Infinite scroll",
  topics: ["demo", "interface"],
  languages: [{ name: "JavaScript" }],
});
const tsOnly = repo("ts-only", {
  description: "Fails on JavaScript files",
  topics: ["demo", "developer-tools"],
  languages: [{ name: "TypeScript" }],
});
const gryphon = repo("gryphon", {
  description: "Satellite data on a map",
  topics: ["demo", "data-viz"],
  languages: [{ name: "TypeScript" }],
});

const repositories = [imageGallery, tsOnly, gryphon];
const tree = buildSearchTree(repositories, repositoryText);

const search = (query: string) =>
  getSearchResults(tree, repositories, query).map(({ name }) => name);

describe("getWords", () => {
  it("lowercases, trims and splits on whitespace", () => {
    expect(getWords("  Satellite DATA  on a map ")).toEqual([
      "satellite",
      "data",
      "on",
      "a",
      "map",
    ]);
  });

  it("splits on hyphens, so each part of a repository name is a word", () => {
    expect(getWords("image-gallery")).toEqual(["image", "gallery"]);
  });

  it("has no words for an empty or blank value", () => {
    expect(getWords("")).toEqual([]);
    expect(getWords("   ")).toEqual([]);
  });
});

describe("buildSearchTree", () => {
  it("maps every prefix of a word to the positions that hold it", () => {
    expect(tree["g"]).toEqual([0, 2]);
    expect(tree["ga"]).toEqual([0]);
    expect(tree["gallery"]).toEqual([0]);
    expect(tree["gryphon"]).toEqual([2]);
  });

  it("records a position once however many times it matches a prefix", () => {
    expect(tree["t"]).toEqual([1, 2]);
  });

  it("holds no prefix longer than the words it indexed", () => {
    expect(tree["gallerys"]).toBeUndefined();
  });
});

describe("getSearchResults", () => {
  it("finds a repository by a prefix of its name", () => {
    expect(search("gry")).toEqual(["gryphon"]);
  });

  it("finds a repository by the second half of its hyphenated name", () => {
    expect(search("gallery")).toEqual(["image-gallery"]);
  });

  it("finds a repository by a word in its description", () => {
    expect(search("satellite")).toEqual(["gryphon"]);
  });

  it("finds repositories by topic", () => {
    expect(search("interface")).toEqual(["image-gallery"]);
    expect(search("demo")).toEqual(["image-gallery", "ts-only", "gryphon"]);
  });

  it("finds repositories by language", () => {
    expect(search("typescript")).toEqual(["ts-only", "gryphon"]);
  });

  it("ignores case and surrounding whitespace", () => {
    expect(search("  GRYphon ")).toEqual(["gryphon"]);
  });

  it("requires every word to match, so words narrow the result", () => {
    expect(search("javascript")).toEqual(["image-gallery", "ts-only"]);
    expect(search("javascript files")).toEqual(["ts-only"]);
  });

  it("returns nothing when one word of several does not match", () => {
    expect(search("gryphon nonsense")).toEqual([]);
  });

  it("returns nothing for an empty query", () => {
    expect(search("")).toEqual([]);
    expect(search("   ")).toEqual([]);
  });

  it("returns nothing when the query matches no prefix", () => {
    expect(search("zzz")).toEqual([]);
  });

  it("keeps the order the repositories came in", () => {
    expect(search("t")).toEqual(["ts-only", "gryphon"]);
  });
});
