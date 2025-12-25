import { Octokit } from "@octokit/core";

export const API_USERNAME = process.env.API_USERNAME;
const API_TOKEN = process.env.API_TOKEN;

const octokit = Octokit.defaults({
  auth: `token ${API_TOKEN}`,
});

export const githubApi = new octokit();