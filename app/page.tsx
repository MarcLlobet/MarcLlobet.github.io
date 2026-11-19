import { App } from "./App";
import { getPortfolioData } from "./data/github";
import { buildSearchTree } from "./lib/search";
import { repositoryText } from "./lib/search/repositories";

export default async function Home() {
  const { repositories, bio } = await getPortfolioData();
  const searchTree = buildSearchTree(repositories, repositoryText);
  return <App repositories={repositories} bio={bio} searchTree={searchTree} />;
}
