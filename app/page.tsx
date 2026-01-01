import { App } from "./App";
import reposData from "./public/data/github-repos.json";
import bioData from "./public/data/github-bio.json";

export default function Home() {
  return <App repositories={reposData.data} bio={bioData.data} />;
}
