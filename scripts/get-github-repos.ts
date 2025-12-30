import type { GraphQlQueryResponseData } from "@octokit/graphql";
import { githubApi, GH_API_USERNAME, createReport } from "./common";
import type { Repository } from "../src/services";

type RepositoryGraphQL = {
  id: string;
  name: string;
  isArchived: boolean;
  owner: { login: string };
  defaultBranchRef: { name: string };
  homepageUrl: string;
  url: string;
  description: string;
  primaryLanguage: { name: string };
  languages: { nodes: { name: string; color: string }[] };
  repositoryTopics: { nodes: { topic: { name: string } }[] };
};

const getPreview = (repo: RepositoryGraphQL): string => {
  return `https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/${repo.defaultBranchRef.name}/.github/preview.png`;
};

export type FetchProjectsResponse = GraphQlQueryResponseData & {
  user: {
    repositories: {
      nodes: RepositoryGraphQL[];
    };
  };
};

const query = `
  query GetGithubRepositories ($login: String!) {
    user(login: $login) {
      repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false, orderBy: {field: CREATED_AT, direction: DESC}) {
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
          languages(first: 5) {
            nodes {
              name
            }
          }
          repositoryTopics(first: 10) {
            nodes {
              topic { name }
            }
          }
        }
      }
    }
  }
`;

export const fetchRepositories = async (): Promise<Repository[]> => {
  const data = await githubApi<FetchProjectsResponse>(query, {
    login: GH_API_USERNAME,
  });
  const repos = data.user.repositories.nodes;
  return repos
    .filter((repo) =>
      repo.repositoryTopics?.nodes?.some((node) => node.topic.name === "demo"),
    )
    .map(
      (repo: RepositoryGraphQL): Repository => ({
        id: repo.id,
        name: repo.name,
        isArchived: repo.isArchived,
        owner: repo.owner,
        defaultBranchRef: repo.defaultBranchRef,
        homepageUrl: repo.homepageUrl,
        url: repo.url,
        description: repo.description,
        primaryLanguage: repo.primaryLanguage,
        languages: repo.languages?.nodes ?? [],
        topics: repo.repositoryTopics?.nodes?.map((n) => n.topic.name) ?? [],
        preview: getPreview(repo),
      }),
    );
};

createReport(fetchRepositories, "github-repos");
