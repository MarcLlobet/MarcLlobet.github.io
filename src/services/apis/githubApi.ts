import { graphql } from "@octokit/graphql";

export const API_USERNAME = import.meta.env.VITE_API_USERNAME;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export const githubApi = graphql.defaults({
  headers: {
    authorization: `token ${API_TOKEN}`,
  },
});
