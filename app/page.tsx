import { App } from "./App";
import { getPortfolioData } from "./data/github";

export default async function Home() {
  const { repositories, bio, pinned, site } = await getPortfolioData();
  return (
    <App repositories={repositories} bio={bio} pinned={pinned} site={site} />
  );
}
