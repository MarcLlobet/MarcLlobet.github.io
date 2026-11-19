import type { Repository } from "../../types";

/**
 * What a repository is searchable by. The name comes first because it is what
 * people type; `topics` and `languages` are flattened so a search for a label
 * or a language finds the projects that carry it.
 */
export const repositoryText = (repository: Repository): readonly string[] => [
  repository.name,
  repository.description,
  ...repository.topics,
  ...repository.languages.map(({ name }) => name),
];
