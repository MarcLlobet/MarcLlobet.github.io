import { Octokit } from "@octokit/core";

export const API_USERNAME = import.meta.env.VITE_API_USERNAME;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const octokit = Octokit.defaults({
  auth: `token ${API_TOKEN}`,
});

export const githubApi = new octokit();