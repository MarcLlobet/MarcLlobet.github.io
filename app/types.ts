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
  languages: { name: string; color?: string }[];
  topics: string[];
  preview: string;
};

/** One day of the GitHub contribution calendar: an ISO date and its commit count. */
export type ContributionDay = {
  date: string;
  count: number;
};
