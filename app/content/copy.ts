import data from "./copy.json";

/** The site's full copy, one level deep: every key is "section.field". */
export const copy = data;

/** Every key the core (eagerly bundled) copy ships with. */
export type CopyKey = keyof typeof copy;
