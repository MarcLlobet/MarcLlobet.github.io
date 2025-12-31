import { codepenApi } from "./apis/codepenApi";
import { githubApi } from "./apis/githubApi";

import type { GithubTypes } from "./apis/githubApi";
import type { CodepenTypes } from "./apis/codepenApi";

export type Repository = GithubTypes["Repository"];
export type Bio = GithubTypes["Bio"];
export type Pen = CodepenTypes["Pen"];

export const fetchRepos = () => githubApi.getRepositories();

export const fetchBio = () => githubApi.getBio();

export const fetchPens = () => codepenApi.getPens();
