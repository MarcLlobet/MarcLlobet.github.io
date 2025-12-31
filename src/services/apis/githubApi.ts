import { apiFetch } from "./apiFetch";

type Repository = {
  id: string;
  name: string;
  isArchived: boolean;
  owner: { login: string };
  defaultBranchRef: { name: string };
  homepageUrl: string;
  url: string;
  description: string;
  primaryLanguage: { name: string };
  languages: { name: string; color: string }[];
  topics: string[];
  preview: string;
};

type Bio = string;

export type GithubTypes = {
  Repository: Repository;
  Bio: Bio;
};

export const githubApi = {
  getRepositories: () => apiFetch<Repository[]>("/data/github-repos.json"),
  getBio: () => apiFetch<Bio>("/data/github-bio.json"),
};
