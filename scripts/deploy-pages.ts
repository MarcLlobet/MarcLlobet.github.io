/**
 * Lets GitHub Pages' "GitHub Actions" source stay as the one deployment
 * mechanism while production and every open PR's preview still coexist on
 * it: actions/deploy-pages only ever publishes one atomic site, so every
 * deploy reassembles the whole thing from a `pages-store` branch — plain
 * git storage between workflow runs, never served by Pages itself —
 * before it's uploaded and deployed.
 *
 *   pnpm tsx scripts/deploy-pages.ts base-path   (writes NEXT_PUBLIC_BASE_PATH to $GITHUB_ENV, before the build)
 *   pnpm tsx scripts/deploy-pages.ts publish     (stores this run's ./out, assembles ./combined)
 *   pnpm tsx scripts/deploy-pages.ts cleanup     (removes this PR's slot, assembles ./combined)
 */
import {
  appendFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import { getPagesContext } from "./pages-context";

const STORE_BRANCH = "pages-store";
const WORKTREE = ".pages-store-worktree";
const SOURCE_DIR = "./out";
const OUT_DIR = "./combined";
const MAX_ATTEMPTS = 5;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Runs git, letting output reach the CI log; throws if it exits non-zero. */
const git = (args: string[], cwd?: string) =>
  execFileSync("git", args, { cwd, stdio: "inherit" });

/** Runs git, swallowing the exit code into a boolean instead of throwing. */
const gitOk = (args: string[], cwd?: string): boolean => {
  try {
    execFileSync("git", args, { cwd, stdio: "inherit" });
    return true;
  } catch {
    return false;
  }
};

const removeWorktree = () => {
  try {
    execFileSync("git", ["worktree", "remove", "--force", WORKTREE], {
      stdio: "ignore",
    });
  } catch {
    rmSync(WORKTREE, { recursive: true, force: true });
  }
};

/** Checks out (or creates) a fresh worktree of the store branch at $WORKTREE. */
const prepareStoreWorktree = () => {
  removeWorktree();
  gitOk(["fetch", "origin", STORE_BRANCH]);

  if (gitOk(["show-ref", "--quiet", `refs/remotes/origin/${STORE_BRANCH}`])) {
    git(["worktree", "add", WORKTREE, `origin/${STORE_BRANCH}`]);
  } else {
    git(["worktree", "add", "--detach", WORKTREE]);
    git(["checkout", "--orphan", STORE_BRANCH], WORKTREE);
    git(["reset", "--hard"], WORKTREE);
    git(["clean", "-fdx"], WORKTREE);
  }
};

/**
 * Publishes or removes one slot on the store branch, retrying on a
 * rejected push — a push to main and a PR update can land at the same
 * moment, and both write to this same branch.
 */
const updateStore = async (
  mode: "publish" | "cleanup",
  slot: string,
  commitMessage: string,
) => {
  const slotPath = `${WORKTREE}/${slot}`;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    prepareStoreWorktree();

    if (mode === "cleanup") {
      if (!existsSync(slotPath)) {
        console.log(`Nothing to clean up at ${slot}.`);
        removeWorktree();
        return;
      }
      rmSync(slotPath, { recursive: true, force: true });
    } else {
      rmSync(slotPath, { recursive: true, force: true });
      mkdirSync(slotPath, { recursive: true });
      cpSync(SOURCE_DIR, slotPath, { recursive: true });
    }

    git(["add", "-A"], WORKTREE);
    const hasChanges = !gitOk(["diff", "--cached", "--quiet"], WORKTREE);
    if (!hasChanges) {
      console.log("No changes to store.");
      removeWorktree();
      return;
    }

    execFileSync(
      "git",
      [
        "-c",
        "user.name=github-actions[bot]",
        "-c",
        "user.email=github-actions[bot]@users.noreply.github.com",
        "commit",
        "--quiet",
        "-m",
        commitMessage,
      ],
      { cwd: WORKTREE, stdio: "inherit" },
    );

    const pushed = gitOk(["push", "origin", `HEAD:${STORE_BRANCH}`], WORKTREE);
    removeWorktree();
    if (pushed) {
      console.log("Stored successfully.");
      return;
    }

    console.log(
      `Push attempt ${attempt} failed (branch moved under us), retrying...`,
    );
    await sleep(attempt * 5000);
  }

  throw new Error(
    `Failed to push to ${STORE_BRANCH} after ${MAX_ATTEMPTS} attempts.`,
  );
};

/** The production slot at the root, every PR-<number> slot as its own subfolder. */
const assembleCombined = () => {
  prepareStoreWorktree();

  const productionPath = `${WORKTREE}/production`;
  if (!existsSync(productionPath)) {
    removeWorktree();
    throw new Error(
      `No production build has ever been stored on ${STORE_BRANCH} yet.`,
    );
  }

  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });
  cpSync(productionPath, OUT_DIR, { recursive: true });

  const slots = readdirSync(WORKTREE, { withFileTypes: true }).filter(
    (entry) => entry.isDirectory() && entry.name.startsWith("PR-"),
  );
  for (const entry of slots) {
    cpSync(`${WORKTREE}/${entry.name}`, `${OUT_DIR}/${entry.name}`, {
      recursive: true,
    });
  }

  removeWorktree();
  console.log(
    `Assembled production + ${slots.length} preview(s) into ${OUT_DIR}.`,
  );
};

const main = async () => {
  const mode = process.argv[2];

  if (mode === "base-path") {
    const { basePath } = getPagesContext();
    const githubEnv = process.env.GITHUB_ENV;
    if (githubEnv)
      appendFileSync(githubEnv, `NEXT_PUBLIC_BASE_PATH=${basePath}\n`);
    console.log(`NEXT_PUBLIC_BASE_PATH=${basePath}`);
    return;
  }

  if (mode !== "publish" && mode !== "cleanup") {
    throw new Error(
      `Unknown mode "${mode}". Expected base-path, publish or cleanup.`,
    );
  }

  const { slot, isPullRequest, prNumber } = getPagesContext();
  if (mode === "cleanup" && !isPullRequest) {
    throw new Error("cleanup only makes sense for a pull_request event.");
  }

  const commitMessage =
    mode === "cleanup"
      ? `Remove preview for PR #${prNumber}`
      : `Update ${slot} (${process.env.GITHUB_SHA ?? "local"})`;

  await updateStore(mode, slot, commitMessage);
  assembleCombined();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
