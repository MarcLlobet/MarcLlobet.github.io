"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSearchResults, type SearchTree } from "../../lib/search";
import { debounce } from "../../utils/schedule";
import type { Repository } from "../../types";

export const SEARCH_DEBOUNCE_MS = 250;

export type UseProjectSearchResult = {
  /** What the input shows: updated on every keystroke. */
  query: string;
  /** What the index was asked for: updated once typing settles. */
  results: readonly Repository[];
  search: (query: string) => void;
  clear: () => void;
};

/**
 * Splits the value the input shows from the value the index is queried with, so
 * typing stays immediate while the lookup runs once the keystrokes settle.
 *
 * Unlike the catalog this was modelled on, an empty query has no results rather
 * than the first N items: the page already lists every project.
 */
export const useProjectSearch = (
  repositories: readonly Repository[],
  searchTree: SearchTree,
  delayMs: number = SEARCH_DEBOUNCE_MS,
): UseProjectSearchResult => {
  const [query, setQuery] = useState("");
  const [term, setTerm] = useState("");

  const scheduled = useMemo(
    () => debounce((next: string) => setTerm(next), delayMs),
    [delayMs],
  );

  useEffect(() => scheduled.cancel, [scheduled]);

  const search = useCallback(
    (next: string) => {
      setQuery(next);
      const trimmed = next.trim();
      if (trimmed === "") {
        scheduled.cancel();
        setTerm("");
        return;
      }
      scheduled.run(trimmed);
    },
    [scheduled],
  );

  const clear = useCallback(() => {
    scheduled.cancel();
    setQuery("");
    setTerm("");
  }, [scheduled]);

  const results = useMemo(
    () => (term === "" ? [] : getSearchResults(searchTree, repositories, term)),
    [term, searchTree, repositories],
  );

  return { query, results, search, clear };
};
