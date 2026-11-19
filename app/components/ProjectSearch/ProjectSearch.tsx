"use client";

import { useId, useState } from "react";
import {
  LiveRegion,
  NoResults,
  ResultLink,
  Results,
  SearchInput,
  SearchWrapper,
  VisuallyHiddenLabel,
} from "./ProjectSearch.styles";
import { useProjectSearch } from "./useProjectSearch";
import type { SearchTree } from "../../lib/search";
import type { Repository } from "../../types";

export type ProjectSearchProps = {
  repositories: Repository[];
  searchTree: SearchTree;
};

const countLabel = (count: number): string =>
  count === 1 ? "1 project found" : `${count} projects found`;

/**
 * A search whose results are links to the sections already on the page, rather
 * than a filter over them. Nothing in the project list moves, so the rail, the
 * scroll snapping and the layout checks keep working exactly as they do without
 * it.
 */
export const ProjectSearch = ({
  repositories,
  searchTree,
}: ProjectSearchProps) => {
  const { query, results, search, clear } = useProjectSearch(
    repositories,
    searchTree,
  );
  const [isDismissed, setIsDismissed] = useState(false);
  // useId() returns an id starting with an underscore, which is not a valid
  // HTML id, so it needs a prefix that begins with a letter.
  const inputId = `project-search${useId()}`;

  const hasQuery = query.trim() !== "";
  const isOpen = hasQuery && !isDismissed;

  const handleChange = (value: string) => {
    setIsDismissed(false);
    search(value);
  };

  const handleKeyDown = (key: string) => {
    if (key === "Escape") {
      clear();
      setIsDismissed(false);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsDismissed(true);
    }
  };

  return (
    <SearchWrapper role="search" onBlur={handleBlur}>
      <VisuallyHiddenLabel htmlFor={inputId}>
        Search projects
      </VisuallyHiddenLabel>
      <SearchInput
        id={inputId}
        type="search"
        value={query}
        placeholder="Search"
        autoComplete="off"
        onChange={(event) => handleChange(event.target.value)}
        onKeyDown={(event) => handleKeyDown(event.key)}
      />
      {isOpen && (
        <Results>
          {results.length === 0 ? (
            <NoResults>No projects match</NoResults>
          ) : (
            results.map(({ id, name }) => (
              <li key={id}>
                <ResultLink href={`#${name}`} onClick={clear}>
                  {name.replace(/-/g, " ")}
                </ResultLink>
              </li>
            ))
          )}
        </Results>
      )}
      <LiveRegion aria-live="polite">
        {hasQuery ? countLabel(results.length) : ""}
      </LiveRegion>
    </SearchWrapper>
  );
};
