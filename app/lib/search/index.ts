/**
 * A prefix index: every prefix of every word maps to the positions of the items
 * that contain it. Built once, so a query costs one lookup per word plus an
 * intersection, instead of scanning the items.
 *
 * Ported from the search in MarcLlobet/mobile-store, generalised over the item
 * type: this index has to reach `topics` and `languages`, which are arrays, so
 * items declare their searchable text through a function rather than by naming
 * their string properties.
 */
export type SearchTree = Readonly<Record<string, readonly number[]>>;

export type TextOf<T> = (item: T) => readonly string[];

type PrefixEntry = {
  prefix: string;
  position: number;
};

const normalize = (value: string): string => value.toLowerCase().trim();

/**
 * Words break on whitespace and on hyphens, so `image-gallery` is indexed as
 * `image` and `gallery` and a search for either one finds it.
 */
export const getWords = (value: string): readonly string[] =>
  normalize(value)
    .split(/[\s-]+/u)
    .filter(Boolean);

const prefixesOf = (word: string): readonly string[] =>
  Array.from({ length: word.length }, (_unused, index) =>
    word.slice(0, index + 1),
  );

const entriesOf = <T>(
  items: readonly T[],
  textOf: TextOf<T>,
): readonly PrefixEntry[] =>
  items.flatMap((item, position) =>
    textOf(item)
      .flatMap((value) => getWords(value))
      .flatMap((word) =>
        prefixesOf(word).map((prefix) => ({ prefix, position })),
      ),
  );

export const buildSearchTree = <T>(
  items: readonly T[],
  textOf: TextOf<T>,
): SearchTree =>
  Object.fromEntries(
    [...Map.groupBy(entriesOf(items, textOf), (entry) => entry.prefix)].map(
      ([prefix, entries]) => [
        prefix,
        [...new Set(entries.map((entry) => entry.position))],
      ],
    ),
  );

const positionsFor = (
  tree: SearchTree,
  word: string,
): readonly number[] | undefined =>
  Object.hasOwn(tree, word) ? tree[word] : undefined;

const at = <T>(
  items: readonly T[],
  positions: readonly number[],
): readonly T[] =>
  positions
    .map((position) => items[position])
    .filter((item): item is T => item !== undefined);

/**
 * Every word in the query has to match, so the result is the intersection of
 * each word's positions. Starting from the shortest list keeps the intersection
 * as small as possible from the first step.
 */
export const getSearchResults = <T>(
  tree: SearchTree,
  items: readonly T[],
  query: string,
): readonly T[] => {
  const words = getWords(query);

  const matches = words
    .map((word) => positionsFor(tree, word))
    .filter(
      (positions): positions is readonly number[] => positions !== undefined,
    );

  if (words.length === 0 || matches.length !== words.length) {
    return [];
  }

  const [narrowest, ...rest] = matches.toSorted((a, b) => a.length - b.length);

  return at(
    items,
    (narrowest ?? []).filter((position) =>
      rest.every((positions) => positions.includes(position)),
    ),
  );
};
