/**
 * Where this CI run's content belongs: the Pages root for production, or
 * this pull request's own PR-<number>/ slot for a preview.
 */
import { readFileSync } from "node:fs";

export type PagesContext = {
  /** "production", or "PR-<number>" for a preview. */
  slot: string;
  /** "" for production, "/PR-<number>" for a preview — becomes NEXT_PUBLIC_BASE_PATH. */
  basePath: string;
  isPullRequest: boolean;
  prNumber: number | null;
};

export const getPagesContext = (): PagesContext => {
  if (process.env.GITHUB_EVENT_NAME !== "pull_request") {
    return {
      slot: "production",
      basePath: "",
      isPullRequest: false,
      prNumber: null,
    };
  }

  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) {
    throw new Error("GITHUB_EVENT_PATH is not set for a pull_request event.");
  }
  const event = JSON.parse(readFileSync(eventPath, "utf8"));
  const prNumber: number = event.pull_request.number;

  return {
    slot: `PR-${prNumber}`,
    basePath: `/PR-${prNumber}`,
    isPullRequest: true,
    prNumber,
  };
};
