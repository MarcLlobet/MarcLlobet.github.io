import { graphql } from "@octokit/graphql";
import type { Bio, Repository } from "../types";
import fixtures from "./fixtures/portfolio.json";

export const DEMO_TOPIC = "demo";

export type PortfolioData = {
  bio: Bio;
  repositories: Repository[];
  /** Names of the repositories pinned on the GitHub profile, in pin order. */
  pinned: string[];
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
  languages: { nodes: { name: string }[] } | null;
  repositoryTopics: { nodes: { topic: { name: string } }[] } | null;
};

type PortfolioQueryResponse = {
  user: {
    bio: string | null;
    pinnedItems?: { nodes: ({ name?: string } | null)[] } | null;
    repositories: { nodes: RepositoryNode[] };
  };
};

const QUERY = `
  query Portfolio($login: String!) {
    user(login: $login) {
      bio
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
          languages(first: 5) { nodes { name } }
          repositoryTopics(first: 10) { nodes { topic { name } } }
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
    languages: node.languages?.nodes ?? [],
    topics: node.repositoryTopics?.nodes.map(({ topic }) => topic.name) ?? [],
    preview: `https://raw.githubusercontent.com/${node.owner.login}/${node.name}/${branch}/.github/preview.png`,
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
  source: "github",
});

export const getPortfolioData = async (): Promise<PortfolioData> => {
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
    const data = fixtures as Omit<PortfolioData, "source" | "pinned"> & {
      pinned?: string[];
    };
    return {
      ...data,
      pinned: data.pinned ?? [],
      source: "fixtures",
    };
  }

  const api = graphql.defaults({
    headers: { authorization: `token ${token}` },
  });
  const response = await api<PortfolioQueryResponse>(QUERY, {
    login: process.env.GH_API_USERNAME || "MarcLlobet",
  });
  const data = toPortfolioData(response);
  console.log(
    `✓ Fetched ${data.repositories.length} "${DEMO_TOPIC}" repositories from GitHub.`,
  );
  return data;
};
