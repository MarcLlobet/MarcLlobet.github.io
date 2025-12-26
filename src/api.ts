import type { Endpoints } from "@octokit/types";
import { API_USERNAME, githubApi } from "./githubApi";

const GET_REPOS_ENDPOINT = 'GET /users/{username}/repos';
type ReposResponse = Endpoints[typeof GET_REPOS_ENDPOINT]["response"];

export type Project = ReposResponse['data'][number] & {
  preview: string
}

const getPreview = (repo: ReposResponse['data'][number]): string => {
  return `https://raw.githubusercontent.com/${API_USERNAME}/${repo.name}/${repo.default_branch}/.github/preview.png`;
}

export const fetchProjects = async (): Promise<Project[]> => {
  const { data: repos }: ReposResponse = await githubApi.request<typeof GET_REPOS_ENDPOINT>(GET_REPOS_ENDPOINT, {
    type: 'owner',
    username: API_USERNAME,
    visibility: 'public',
  });

  const updatedRepos = repos
    .filter(repo => !repo.archived)
    .map<Project>((repo) => ({
      ...repo,
      preview: getPreview(repo),
    }));

  return updatedRepos;
};