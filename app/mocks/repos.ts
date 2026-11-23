import type { Repository } from "../types";

export const mockRepos: Repository[] = [
  {
    id: "1",
    name: "repo-1",
    isArchived: false,
    owner: { login: "marc" },
    defaultBranchRef: { name: "main" },
    homepageUrl: "https://demo.com",
    url: "https://github.com/marc/repo-1",
    description: "Test repo",
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
    description: "Test repo 2",
    primaryLanguage: { name: "CSS" },
    languages: [{ name: "CSS", color: "#c6318fff" }],
    topics: ["demo"],
    preview: "https://preview-2.png",
  },
];
