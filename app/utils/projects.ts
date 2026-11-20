import type { Repository } from "../types";

/** How many projects get a full case; the rest go to the archive index. */
export const MAX_FEATURED = 6;

/** One accent per project, used for its frame, mockup and the triangle. */
export const ACCENTS = [
  "#5B9BFF",
  "#FF7A45",
  "#B6F24A",
  "#E879F9",
  "#F2C94C",
  "#4FD1C5",
] as const;

export const accentFor = (index: number) => ACCENTS[index % ACCENTS.length];

/** Languages GitHub reports that say nothing about how a project is built. */
const IGNORED_LANGUAGES = new Set(["Bru", "Makefile", "Dockerfile"]);

export const visibleLanguages = (repository: Repository): string[] => {
  const names = [
    repository.primaryLanguage.name,
    ...repository.languages.map(({ name }) => name),
  ];
  return [...new Set(names)].filter(
    (name) => name && !IGNORED_LANGUAGES.has(name),
  );
};

/**
 * The GitHub description holds both texts: "Tagline — detail".
 * Only the first em dash (or en dash) between spaces splits them.
 */
export const splitDescription = (
  description: string,
): { tagline: string; detail: string } => {
  const match = description.match(/^([\s\S]+?)\s+[—–]\s+([\s\S]+)$/);
  if (!match) return { tagline: description.trim(), detail: "" };
  const detail = match[2].trim();
  return {
    tagline: match[1].trim(),
    detail: detail.charAt(0).toUpperCase() + detail.slice(1),
  };
};

export const displayName = (name: string) => name.replaceAll("-", " ");

/**
 * Featured projects are the pinned ones, in pin order. Without pins, the
 * newest projects are featured. Everything else goes to the archive.
 */
export const selectProjects = (
  repositories: Repository[],
  pinned: string[],
): { featured: Repository[]; archive: Repository[] } => {
  const byName = new Map(repositories.map((repo) => [repo.name, repo]));
  const pinnedRepos = pinned
    .map((name) => byName.get(name))
    .filter((repo): repo is Repository => Boolean(repo));
  const featured = (
    pinnedRepos.length ? pinnedRepos : repositories.slice(0, MAX_FEATURED)
  ).slice(0, MAX_FEATURED);
  const featuredNames = new Set(featured.map(({ name }) => name));
  return {
    featured,
    archive: repositories.filter(({ name }) => !featuredNames.has(name)),
  };
};
