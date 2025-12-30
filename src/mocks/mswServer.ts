import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

import { mockPens } from "./pens";
import { mockGetGithubUserData } from "./bio";
import { mockRepos } from "./repos";

export const handlers = [
  http.get("/data/github-repos.json", () => {
    return HttpResponse.json(mockRepos);
  }),
  http.get("/data/github-bio.json", () => {
    return HttpResponse.json(mockGetGithubUserData);
  }),
  http.get("/data/codepen-pens.json", () => {
    return HttpResponse.json(mockPens);
  }),
];

export const server = setupServer(...handlers);
