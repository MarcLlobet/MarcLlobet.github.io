import { setupServer } from "msw/node";
import { http, graphql, HttpResponse } from "msw";

import { mockPens } from "./pens";
import { mockGetGithubUserData } from "./bio";
import { mockGetGithubRepositories } from "./repos";

export const handlers = [
  graphql.query("GetGithubRepositories", () => {
    return HttpResponse.json({ data: mockGetGithubRepositories });
  }),
  graphql.query("GetGithubUserData", () => {
    return HttpResponse.json({ data: mockGetGithubUserData });
  }),
  http.get("/codepen-pens.json", () => {
    return HttpResponse.json(mockPens);
  }),
];

export const server = setupServer(...handlers);
