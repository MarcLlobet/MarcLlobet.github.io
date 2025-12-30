import type { Repository } from "../services";

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
  return sortedLanguages.map(([language]) => language);
};
