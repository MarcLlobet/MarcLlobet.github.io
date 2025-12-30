import { createReport, GH_API_USERNAME, githubApi } from "./common";
import type { GraphQlQueryResponseData } from "@octokit/graphql";

export type FetchBioResponse = GraphQlQueryResponseData & {
  user: {
    bio: string;
  };
};

export const fetchBio = async (): Promise<string> => {
  const query = `
    query GetGithubUserData ($login: String!) {
      user(login: $login) {
        bio
      }
    }
  `;
  const data = await githubApi<FetchBioResponse>(query, {
    login: GH_API_USERNAME,
  });
  return data.user.bio ?? "";
};

createReport(fetchBio, "github-bio");
