import { describe, expect, it } from "vitest";
import { getAllLanguages } from "./getAllLanguages";
import { mockRepos } from "../mocks/repos";

describe("getAllLanguages", () => {
  it("returns a sorted array of languages from repositories", () => {
    const result = getAllLanguages(mockRepos);
    expect(result).toEqual(["TypeScript", "CSS"]);
  });

  it("leaves out tooling such as Bru", () => {
    const result = getAllLanguages([
      { ...mockRepos[0], languages: [{ name: "Bru" }, { name: "CSS" }] },
    ]);
    expect(result).toEqual(["TypeScript", "CSS"]);
  });
});
