import { App } from "./App";
import { getPortfolioData } from "./data/github";

export default async function Home() {
  const { repositories, bio, pinned } = await getPortfolioData();
  return <App repositories={repositories} bio={bio} pinned={pinned} />;
}
