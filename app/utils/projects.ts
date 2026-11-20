import type { Repository } from "../types";

/** How many projects get a full case; the rest go to the archive index. */
export const MAX_FEATURED = 6;

/**
 * One accent per project, used for its frame, mockup and the triangle. They are
 * CSS tokens (GlobalStyles) so each theme has its own shade.
 */
export const ACCENTS = [
  "--accent-1",
  "--accent-2",
  "--accent-3",
  "--accent-4",
  "--accent-5",
  "--accent-6",
] as const;

/** The accent of the project at `index`, as a CSS value: var(--accent-n). */
export const accentFor = (index: number) =>
  `var(${ACCENTS[index % ACCENTS.length]})`;

/** Languages GitHub reports that say nothing about how a project is built. */
export const IGNORED_LANGUAGES = new Set(["Bru", "Makefile", "Dockerfile"]);

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
 * A sentence ends at a full stop followed by a capital, so "Next.js" and
 * "No. 5" stay whole.
 */
const SENTENCE = /^([\s\S]+?[.!?])\s+([A-Z][\s\S]*)$/;

/** The opening sentence of a text, or all of it when it is only one. */
export const firstSentence = (text: string) => {
  const trimmed = text.trim();
  return trimmed.match(SENTENCE)?.[1] ?? trimmed;
};

/**
 * The GitHub description holds both texts: "Tagline — detail". The first em
 * dash (or en dash) between spaces splits them; without one, the first
 * sentence is the tagline and whatever follows it is the detail.
 */
export const splitDescription = (
  description: string,
): { tagline: string; detail: string } => {
  const text = description.trim();
  const match =
    text.match(/^([\s\S]+?)\s+[—–]\s+([\s\S]+)$/) ?? text.match(SENTENCE);
  if (!match) return { tagline: text, detail: "" };
  const detail = match[2].trim();
  return {
    tagline: match[1].trim(),
    detail: detail.charAt(0).toUpperCase() + detail.slice(1),
  };
};

export const displayName = (name: string) => name.replaceAll("-", " ");

/**
 * Featured projects are exactly the pinned ones, in pin order, matched by the
 * repository's git name. There is no fallback: a repo is featured only if it
 * is both pinned and tagged "demo". Everything else goes to the archive.
 */
export const selectProjects = (
  repositories: Repository[],
  pinned: string[],
): { featured: Repository[]; archive: Repository[] } => {
  const byName = new Map(repositories.map((repo) => [repo.name, repo]));
  const featured = pinned
    .map((name) => byName.get(name))
    .filter((repo): repo is Repository => Boolean(repo))
    .slice(0, MAX_FEATURED);
  const featuredNames = new Set(featured.map(({ name }) => name));
  return {
    featured,
    archive: repositories.filter(({ name }) => !featuredNames.has(name)),
  };
};

/** Pinned repositories that will not be featured because they lack the "demo" topic. */
export const unmatchedPins = (repositories: Repository[], pinned: string[]) => {
  const names = new Set(repositories.map(({ name }) => name));
  return pinned.filter((name) => !names.has(name));
};
