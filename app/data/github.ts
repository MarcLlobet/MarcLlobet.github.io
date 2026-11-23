import { cache } from "react";
import { graphql } from "@octokit/graphql";
import type { ContributionDay, Repository } from "../types";
import fixtures from "./fixtures/portfolio.json";
import { unmatchedPins } from "../utils/projects";

export const DEMO_TOPIC = "demo";
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export type PortfolioData = {
  bio: string;
  repositories: Repository[];
  /** Names of the repositories pinned on the GitHub profile, in pin order. */
  pinned: string[];
  /** The last year of the GitHub contribution calendar, oldest day first. */
  contributions: ContributionDay[];
  source: "github" | "fixtures";
};

type RepositoryNode = {
  id: string;
  name: string;
  isArchived: boolean;
  owner: { login: string };
  defaultBranchRef: { name: string } | null;
  homepageUrl: string | null;
  url: string;
  description: string | null;
  primaryLanguage: { name: string } | null;
  languages: {
    edges: { size: number; node: { name: string; color: string | null } }[];
  } | null;
  repositoryTopics: { nodes: { topic: { name: string } }[] } | null;
  stargazerCount: number;
  createdAt: string;
  pushedAt: string;
};

type PortfolioQueryResponse = {
  user: {
    bio: string | null;
    contributionsCollection?: {
      contributionCalendar: {
        weeks: {
          contributionDays: { date: string; contributionCount: number }[];
        }[];
      };
    };
    pinnedItems?: { nodes: ({ name?: string } | null)[] } | null;
    repositories: { nodes: RepositoryNode[] };
  };
};

const QUERY = `
  query Portfolio($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      bio
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
      pinnedItems(first: 6, types: [REPOSITORY]) {
        nodes { ... on Repository { name } }
      }
      repositories(
        first: 100
        ownerAffiliations: OWNER
        privacy: PUBLIC
        isFork: false
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
        nodes {
          id
          name
          isArchived
          owner { login }
          defaultBranchRef { name }
          url
          homepageUrl
          description
          primaryLanguage { name }
          languages(first: 10) {
            edges { size node { name color } }
          }
          repositoryTopics(first: 10) { nodes { topic { name } } }
          stargazerCount
          createdAt
          pushedAt
        }
      }
    }
  }
`;

const toRepository = (node: RepositoryNode): Repository => {
  const branch = node.defaultBranchRef?.name ?? "main";
  return {
    id: node.id,
    name: node.name,
    isArchived: node.isArchived,
    owner: node.owner,
    defaultBranchRef: { name: branch },
    homepageUrl: node.homepageUrl ?? "",
    url: node.url,
    description: node.description ?? "",
    primaryLanguage: node.primaryLanguage ?? { name: "" },
    languages: (node.languages?.edges ?? []).map(({ size, node: lang }) => ({
      name: lang.name,
      color: lang.color ?? undefined,
      bytes: size,
    })),
    topics: node.repositoryTopics?.nodes.map(({ topic }) => topic.name) ?? [],
    preview: `https://raw.githubusercontent.com/${node.owner.login}/${node.name}/${branch}/.github/preview.png`,
    stars: node.stargazerCount,
    createdAt: node.createdAt,
    pushedAt: node.pushedAt,
  };
};

export const toPortfolioData = (
  response: PortfolioQueryResponse,
): PortfolioData => ({
  bio: response.user.bio ?? "",
  repositories: response.user.repositories.nodes
    .map(toRepository)
    .filter(({ topics }) => topics.includes(DEMO_TOPIC)),
  pinned: (response.user.pinnedItems?.nodes ?? [])
    .map((node) => node?.name)
    .filter((name): name is string => Boolean(name)),
  contributions: (
    response.user.contributionsCollection?.contributionCalendar.weeks ?? []
  ).flatMap(({ contributionDays }) =>
    contributionDays.map(({ date, contributionCount }) => ({
      date,
      count: contributionCount,
    })),
  ),
  source: "github",
});

/**
 * A year of plausible, deterministic contribution counts for local
 * development: no token means no real calendar to show, but the shape
 * (and roughly commit-like weekday/weekend rhythm) should still be real.
 */
const fixtureContributions = (): ContributionDay[] => {
  const today = new Date();
  return Array.from({ length: 365 }, (_, i) => {
    const date = new Date(today.getTime() - (364 - i) * 24 * 60 * 60 * 1000);
    const isWeekend = date.getUTCDay() === 0 || date.getUTCDay() === 6;
    const wave = Math.sin(i / 9) * 3 + Math.sin(i / 37) * 2;
    const count = Math.max(0, Math.round(3 + wave - (isWeekend ? 2 : 0)));
    return { date: date.toISOString().slice(0, 10), count };
  });
};

/*
 * The layout and every page now call this independently during the same
 * static build (the persistent shell needs `pinned`/`repositories` for
 * hasArchive, each page needs its own slice) — cache() dedupes the
 * underlying GitHub call within that single render pass.
 */
export const getPortfolioData = cache(async (): Promise<PortfolioData> => {
  const token = process.env.GH_API_TOKEN;

  if (!token) {
    if (process.env.PORTFOLIO_REQUIRE_LIVE_DATA === "true") {
      throw new Error(
        "GH_API_TOKEN is not set, and PORTFOLIO_REQUIRE_LIVE_DATA=true forbids building with fixture data.",
      );
    }
    console.warn(
      "⚠ GH_API_TOKEN is not set: building with fixture data (app/data/fixtures/portfolio.json).",
    );
    const data = fixtures as Omit<
      PortfolioData,
      "source" | "pinned" | "contributions"
    > & {
      pinned?: string[];
    };
    return {
      ...data,
      pinned: data.pinned ?? [],
      contributions: fixtureContributions(),
      source: "fixtures",
    };
  }

  const api = graphql.defaults({
    headers: { authorization: `token ${token}` },
  });
  const now = new Date();
  const response = await api<PortfolioQueryResponse>(QUERY, {
    login: process.env.GH_API_USERNAME || "MarcLlobet",
    from: new Date(now.getTime() - ONE_YEAR_MS).toISOString(),
    to: now.toISOString(),
  });
  const data = toPortfolioData(response);
  console.log(
    `✓ Fetched ${data.repositories.length} "${DEMO_TOPIC}" repositories from GitHub, ${data.pinned.length} pinned, ${data.contributions.length} days of contributions.`,
  );
  const skipped = unmatchedPins(data.repositories, data.pinned);
  if (skipped.length) {
    console.warn(
      `⚠ Pinned but not tagged "${DEMO_TOPIC}", so not featured: ${skipped.join(", ")}.`,
    );
  }
  return data;
});
