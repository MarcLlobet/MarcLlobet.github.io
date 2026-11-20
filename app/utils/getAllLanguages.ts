import type { Repository } from "../types";
import { IGNORED_LANGUAGES } from "./projects";

export const getAllLanguages = (repositories: Repository[]) => {
  const valueByLanguages = repositories.reduce(
    (prev, repo) => ({
      ...prev,
      ...repo.languages.reduce(
        (langPrev, lang) => ({
          ...langPrev,
          [lang.name]: (prev[lang.name] ?? 0) + 1,
        }),
        {} as Record<string, number>,
      ),
      [repo.primaryLanguage.name]: (prev[repo.primaryLanguage.name] ?? 0) + 3,
    }),
    {} as Record<Repository["name"], number>,
  );

  const sortedLanguages = Object.entries(valueByLanguages).sort(
    ([, a], [, b]) => b - a,
  );
  return sortedLanguages
    .map(([language]) => language)
    .filter((language) => language && !IGNORED_LANGUAGES.has(language));
};
