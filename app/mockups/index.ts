import type { Repository } from "../types";
import { MOCKUP_KINDS, type MockupKind } from "./shapes";

export { buildMockup, MOCKUP_KINDS } from "./shapes";
export type { MockupKind, Shape, Tone, Loop } from "./shapes";

/**
 * The mockup drawn for each project. Mockups belong to the portfolio's look,
 * so they live here, not in each project's repository.
 */
export const MOCKUP_BY_REPOSITORY: Record<string, MockupKind> = {
  gryphon: "map",
  "mobile-store": "store",
  "gym-grid": "matrix",
  "ts-only": "terminal",
  "wordle-app": "tiles",
  "semantic-git": "graph",
  adventofcode: "tiles",
  "fluency-report": "matrix",
  "users-by-colors": "matrix",
  "image-gallery": "store",
  "vanilla-documents": "terminal",
  "scheduling-ui": "matrix",
};

const TOPIC_PREFIX = "mockup-";

const isKind = (value: string): value is MockupKind =>
  (MOCKUP_KINDS as readonly string[]).includes(value);

const hash = (text: string) =>
  [...text].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) | 0, 7);

/**
 * A project gets its own mockup when it has one; otherwise a `mockup-<kind>`
 * topic picks the archetype; otherwise one is picked from its name.
 * A new repository never breaks the build.
 */
export const mockupFor = (repository: Repository): MockupKind => {
  const own = MOCKUP_BY_REPOSITORY[repository.name];
  if (own) return own;
  const fromTopic = repository.topics
    .find((topic) => topic.startsWith(TOPIC_PREFIX))
    ?.slice(TOPIC_PREFIX.length);
  if (fromTopic && isKind(fromTopic)) return fromTopic;
  return MOCKUP_KINDS[Math.abs(hash(repository.name)) % MOCKUP_KINDS.length];
};

export const hasOwnMockup = (repository: Repository) =>
  repository.name in MOCKUP_BY_REPOSITORY;
