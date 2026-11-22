import type { Repository } from "../types";
import { IGNORED_LANGUAGES } from "./projects";

export const getAllLanguages = (repositories: Repository[]) => {
  const scoreByLanguage = new Map<string, number>();
  const add = (language: string, weight: number) =>
    scoreByLanguage.set(
      language,
      (scoreByLanguage.get(language) ?? 0) + weight,
    );

  for (const repo of repositories) {
    repo.languages.forEach(({ name }) => add(name, 1));
    add(repo.primaryLanguage.name, 3);
  }

  return [...scoreByLanguage.entries()]
    .sort(([, a], [, b]) => b - a)
    .map(([language]) => language)
    .filter((language) => language && !IGNORED_LANGUAGES.has(language));
};
