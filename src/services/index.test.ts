import { describe, it, expect } from "vitest";
import { fetchRepos, fetchPens, fetchBio, type Repository } from "./index";
import type { Pen } from "../services";
describe("services/index", () => {
  it("returns repositories when we call fetchRepos", async () => {
    const repos: Repository[] = await fetchRepos();
    expect(repos).toBeDefined();
    expect(Array.isArray(repos)).toBe(true);
    expect(repos[0].name).toBe("repo-1");
    expect(repos[0].preview).toContain("preview-1.png");
  });

  it("returns pens when we call fetchPens", async () => {
    const pens: Pen[] = await fetchPens();
    expect(pens).toBeDefined();
    expect(Array.isArray(pens)).toBe(true);
    expect(pens[0].name).toBe("Pen de prova");
    expect(pens[0].preview.large).toContain("large");
    expect(pens[0].preview.small).toContain("small");
  });

  it("returns bio when we call fetchBio", async () => {
    const bio = await fetchBio();
    expect(bio).toEqual("Test bio");
  });
});
