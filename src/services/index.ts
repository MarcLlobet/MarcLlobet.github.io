
import type { GraphQlQueryResponseData } from "@octokit/graphql";
import { API_USERNAME, githubApi } from "./apis/githubApi";

export type Repository = {
  id: string;
  name: string;
  isArchived: boolean;
  owner: { login: string };
  defaultBranchRef: { name: string };
  homepageUrl: string;
  url: string;
  description: string;
  primaryLanguage: { name: string };
  preview: string;
}

const getPreview = (repo: Repository): string => {
  return `https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/${repo.defaultBranchRef.name}/.github/preview.png`;
};

type FetchProjectsResponse = GraphQlQueryResponseData & {
  user: {
    repositories: {
      nodes: Repository[];
    };
  };
};

export const fetchRepositories = async (): Promise<Repository[]> => {
  const query = `
    query($login: String!) {
      user(login: $login) {
        repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false, orderBy: {field: UPDATED_AT, direction: DESC}) {
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
          }
        }
      }
    }
  `;
  const data = await githubApi<FetchProjectsResponse>(query, { 
    login: API_USERNAME,
  });
  const repos = data.user.repositories.nodes;
  return repos
    .filter(repo => !repo.isArchived)
    .filter(repo => !repo.name.includes(API_USERNAME))
    .map(repo => ({
      ...repo,
      preview: getPreview(repo),
    }));
};



type FetchBioResponse = GraphQlQueryResponseData & {
  user: {
    bio: string;
  };
};

export const fetchBio = async (): Promise<string> => {
  const query = `
    query($login: String!) {
      user(login: $login) {
        bio
      }
    }
  `;
  const data = await githubApi<FetchBioResponse>(query, { login: API_USERNAME });
  return data.user.bio ?? '';
};