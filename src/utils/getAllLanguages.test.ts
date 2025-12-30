import { describe, expect, it } from "vitest";
import { getAllLanguages } from "./getAllLanguages";
import { mockRepos } from "../mocks/repos";

describe("getAllLanguages", () => {
  it("returns a sorted array of languages from repositories", () => {
    const result = getAllLanguages(mockRepos.data);
    expect(result).toEqual(["TypeScript", "CSS"]);
  });
});
