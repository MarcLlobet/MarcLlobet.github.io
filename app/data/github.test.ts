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
  languages: {
    edges: [
      { size: 1000, node: { name: "TypeScript", color: "#3178c6" } },
      { size: 200, node: { name: "CSS", color: null } },
    ],
  },
  repositoryTopics: { nodes: topics.map((name) => ({ topic: { name } })) },
  stargazerCount: 3,
  createdAt: "2024-01-01T00:00:00Z",
  pushedAt: "2026-06-01T00:00:00Z",
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
        contributionsCollection: {
          contributionCalendar: {
            weeks: [
              {
                contributionDays: [
                  { date: "2026-01-01", contributionCount: 2 },
                  { date: "2026-01-02", contributionCount: 0 },
                ],
              },
              {
                contributionDays: [
                  { date: "2026-01-03", contributionCount: 5 },
                ],
              },
            ],
          },
        },
        pinnedItems: { nodes: [{ name: "mobile-store" }, {}, null] },
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
    expect(data.pinned).toEqual(["mobile-store"]);
    expect(data.repositories[0]).toMatchObject({
      languages: [
        { name: "TypeScript", color: "#3178c6", bytes: 1000 },
        { name: "CSS", bytes: 200 },
      ],
      topics: ["demo", "nextjs"],
      preview:
        "https://raw.githubusercontent.com/MarcLlobet/mobile-store/main/.github/preview.png",
      stars: 3,
      createdAt: "2024-01-01T00:00:00Z",
      pushedAt: "2026-06-01T00:00:00Z",
    });
    expect(data.contributions).toEqual([
      { date: "2026-01-01", count: 2 },
      { date: "2026-01-02", count: 0 },
      { date: "2026-01-03", count: 5 },
    ]);
    expect(request).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        login: "MarcLlobet",
        from: expect.any(String),
        to: expect.any(String),
      }),
    );
  });

  it("falls back to fixtures when there is no token", async () => {
    vi.stubEnv("GH_API_TOKEN", "");

    const { getPortfolioData } = await import("./github");
    const data = await getPortfolioData();

    expect(data.source).toBe("fixtures");
    expect(data.repositories.length).toBeGreaterThan(0);
    expect(Array.isArray(data.pinned)).toBe(true);
    expect(data.contributions).toHaveLength(365);
    expect(data.contributions[0]).toMatchObject({
      date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      count: expect.any(Number),
    });
    expect(request).not.toHaveBeenCalled();
  });

  it("refuses fixtures when live data is required", async () => {
    vi.stubEnv("GH_API_TOKEN", "");
    vi.stubEnv("PORTFOLIO_REQUIRE_LIVE_DATA", "true");

    const { getPortfolioData } = await import("./github");

    await expect(getPortfolioData()).rejects.toThrow(/GH_API_TOKEN/);
  });
});
