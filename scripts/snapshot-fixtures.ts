/**
 * Refreshes app/data/fixtures/portfolio.json with live GitHub data: the bio,
 * the pinned repositories, every repository tagged "demo", and this site's
 * own repo (what the Meta section describes itself with). The fixture is
 * what the site falls back to when GH_API_TOKEN is not set.
 *
 *   pnpm snapshot:fixtures
 */
import { writeFile } from "node:fs/promises";
import { config } from "dotenv";
import { format } from "prettier";

config({ path: [".env.local", ".env"], quiet: true });
process.env.PORTFOLIO_REQUIRE_LIVE_DATA = "true";

const FIXTURE = "app/data/fixtures/portfolio.json";

const run = async () => {
  const { getPortfolioData } = await import("../app/data/github");
  const data = await getPortfolioData();
  const fixture = {
    bio: data.bio,
    pinned: data.pinned,
    repositories: data.repositories,
    site: data.site,
  };

  await writeFile(
    FIXTURE,
    await format(JSON.stringify(fixture), { parser: "json" }),
  );
  console.log(
    `✓ ${FIXTURE}: ${data.repositories.length} repositories, ${data.pinned.length} pinned (${data.pinned.join(", ") || "none"}).`,
  );
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
