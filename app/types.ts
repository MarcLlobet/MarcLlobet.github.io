export type Repository = {
  id: string;
  name: string;
  isArchived: boolean;
  owner: { login: string };
  defaultBranchRef: { name: string };
  homepageUrl: string;
  url: string;
  description: string;
  primaryLanguage: { name: string };
  languages: { name: string; color?: string; bytes?: number }[];
  topics: string[];
  preview: string;
  /** GitHub star count. */
  stars: number;
  /** ISO timestamps, straight from the GitHub API. */
  createdAt: string;
  pushedAt: string;
};

/** Just enough of a repository to say what it is and what it's built with. */
export type SiteRepository = Pick<
  Repository,
  "description" | "primaryLanguage" | "languages"
>;

/** One day of the GitHub contribution calendar: an ISO date and its commit count. */
export type ContributionDay = {
  date: string;
  count: number;
};
