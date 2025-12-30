import "dotenv/config";
import { graphql } from "@octokit/graphql";
import { writeFileSync } from "fs";

export const GH_API_USERNAME = process.env.GH_API_USERNAME;
const GH_API_TOKEN = process.env.GH_API_TOKEN;

export const githubApi = graphql.defaults({
  headers: {
    authorization: `token ${GH_API_TOKEN}`,
  },
});

export type DataResponse<T> = {
  data: T;
  queryId: string;
};

export const createReport = async <T>(
  asyncIntructions: () => Promise<T>,
  name: string,
) => {
  const response: T = await asyncIntructions();
  writeFileSync(
    `public/data/${name}.json`,
    JSON.stringify(
      {
        data: response,
        queryId: name,
      } as DataResponse<T>,
      null,
      2,
    ),
    null,
  );
  console.log(`✓ ${name}.json generated.`);
};
