import { codepenApi } from "./apis/codepenApi";
import { githubApi } from "./apis/githubApi";

import type { GithubTypes } from "./apis/githubApi";
import type { CodepenTypes } from "./apis/codepenApi";

export type Repository = GithubTypes["Repository"];
export type Bio = GithubTypes["Bio"];
export type Pen = CodepenTypes["Pen"];

export const fetchRepos = async () => {
  const repos = await githubApi.getRepositories();
  return repos;
};

export const fetchBio = async () => {
  const bio = await githubApi.getBio();
  return bio;
};

export const fetchPens = async () => {
  const pens = await codepenApi.getPens();
  return pens;
};
