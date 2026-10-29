import { App } from "./App";
import { getPortfolioData } from "./data/github";

// Rendered once during `next build` (static export): the data is fetched
// from GitHub at build time and baked into the HTML.
export default async function Home() {
  const { repositories, bio } = await getPortfolioData();
  return <App repositories={repositories} bio={bio} />;
}
