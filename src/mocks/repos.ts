import type { FetchProjectsResponse, Repository } from "../services";

export const mockRepos: Repository[] = [
  {
    id: "1",
    name: "repo-1",
    isArchived: false,
    owner: { login: "marc" },
    defaultBranchRef: { name: "main" },
    homepageUrl: "https://demo.com",
    url: "https://github.com/marc/repo-1",
    description: "Repo de prova",
    primaryLanguage: { name: "TypeScript" },
    languages: [{ name: "TypeScript", color: "#3178c6" }],
    topics: ["demo"],
    preview: "https://preview-1.png",
  },
  {
    id: "2",
    name: "repo-2",
    isArchived: false,
    owner: { login: "marc" },
    defaultBranchRef: { name: "main" },
    homepageUrl: "https://demo.com",
    url: "https://github.com/marc/repo-2",
    description: "Repo de prova 2",
    primaryLanguage: { name: "CSS" },
    languages: [{ name: "CSS", color: "#c6318fff" }],
    topics: ["demo"],
    preview: "https://preview-2.png",
  },
];

export const mockGetGithubRepositories: FetchProjectsResponse = {
  user: {
    repositories: {
      nodes: [
        {
          id: "1",
          name: "repo-1",
          isArchived: false,
          owner: { login: "marc" },
          defaultBranchRef: { name: "main" },
          homepageUrl: "https://demo.com",
          url: "https://github.com/marc/repo-1",
          description: "Repo de prova",
          primaryLanguage: { name: "TypeScript" },
          languages: { nodes: [{ name: "TypeScript", color: "#3178c6" }] },
          repositoryTopics: { nodes: [{ topic: { name: "demo" } }] },
        },
        {
          id: "2",
          name: "repo-2",
          isArchived: false,
          owner: { login: "marc" },
          defaultBranchRef: { name: "main" },
          homepageUrl: "https://demo2.com",
          url: "https://github.com/marc/repo-2",
          description: "Repo de prova 2",
          primaryLanguage: { name: "JavaScript" },
          languages: { nodes: [{ name: "JavaScript", color: "#f7df1e" }] },
          repositoryTopics: { nodes: [{ topic: { name: "demo" } }] },
        },
      ],
    },
  },
};
