/**
 * Posts this PR's preview link as a comment, updating one already left by
 * an earlier push instead of piling up duplicates.
 *
 *   pnpm tsx scripts/comment-preview-link.ts
 */
import { getPagesContext } from "./pages-context";

const MARKER = "<!-- pr-preview-link -->";

type Comment = { id: number; body?: string };

const callApi = async (path: string, init?: RequestInit) => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is required.");
  const repo = process.env.GITHUB_REPOSITORY;
  if (!repo) throw new Error("GITHUB_REPOSITORY is required.");

  const response = await fetch(`https://api.github.com/repos/${repo}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(
      `GitHub API ${path} failed: ${response.status} ${await response.text()}`,
    );
  }
  return response.json();
};

const main = async () => {
  const { isPullRequest, prNumber } = getPagesContext();
  if (!isPullRequest || !prNumber) {
    throw new Error(
      "comment-preview-link only makes sense for a pull_request event.",
    );
  }

  const url = `https://marcllobet.github.io/PR-${prNumber}/`;
  const body = `${MARKER}\n🔎 Preview deployed: ${url}`;

  const comments: Comment[] = await callApi(`/issues/${prNumber}/comments`);
  const existing = comments.find((comment) => comment.body?.includes(MARKER));

  if (existing) {
    await callApi(`/issues/comments/${existing.id}`, {
      method: "PATCH",
      body: JSON.stringify({ body }),
    });
  } else {
    await callApi(`/issues/${prNumber}/comments`, {
      method: "POST",
      body: JSON.stringify({ body }),
    });
  }

  console.log(`Commented preview link on PR #${prNumber}: ${url}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
