import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const request = vi.fn();

vi.mock("@octokit/graphql", () => ({
  graphql: { defaults: () => request },
}));

const node = (name: string, topics: string[]) => ({
  id: `id-${name}`,
  name,
  isArchived: false,
  owner: { login: "MarcLlobet" },
  defaultBranchRef: { name: "main" },
  homepageUrl: `https://marcllobet.github.io/${name}/`,
  url: `https://github.com/MarcLlobet/${name}`,
  description: `About ${name}`,
  primaryLanguage: { name: "TypeScript" },
  languages: { nodes: [{ name: "TypeScript" }, { name: "CSS" }] },
  repositoryTopics: { nodes: topics.map((name) => ({ topic: { name } })) },
});

describe("getPortfolioData", () => {
  beforeEach(() => {
    vi.resetModules();
    request.mockReset();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("fetches the bio and only the repositories tagged demo", async () => {
    vi.stubEnv("GH_API_TOKEN", "token");
    request.mockResolvedValue({
      user: {
        bio: "Frontend developer",
        repositories: {
          nodes: [
            node("mobile-store", ["demo", "nextjs"]),
            node("dotfiles", []),
          ],
        },
      },
    });

    const { getPortfolioData } = await import("./github");
    const data = await getPortfolioData();

    expect(data.source).toBe("github");
    expect(data.bio).toBe("Frontend developer");
    expect(data.repositories.map(({ name }) => name)).toEqual(["mobile-store"]);
    expect(data.repositories[0]).toMatchObject({
      languages: [{ name: "TypeScript" }, { name: "CSS" }],
      topics: ["demo", "nextjs"],
      preview:
        "https://raw.githubusercontent.com/MarcLlobet/mobile-store/main/.github/preview.png",
    });
  });

  it("falls back to fixtures when there is no token", async () => {
    vi.stubEnv("GH_API_TOKEN", "");

    const { getPortfolioData } = await import("./github");
    const data = await getPortfolioData();

    expect(data.source).toBe("fixtures");
    expect(data.repositories.length).toBeGreaterThan(0);
    expect(request).not.toHaveBeenCalled();
  });

  it("refuses fixtures when live data is required", async () => {
    vi.stubEnv("GH_API_TOKEN", "");
    vi.stubEnv("PORTFOLIO_REQUIRE_LIVE_DATA", "true");

    const { getPortfolioData } = await import("./github");

    await expect(getPortfolioData()).rejects.toThrow(/GH_API_TOKEN/);
  });
});
