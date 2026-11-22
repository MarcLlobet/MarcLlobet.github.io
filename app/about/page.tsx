import type { Metadata } from "next";
import { getPortfolioData } from "../data/github";
import { GITHUB_URL } from "../constants";
import { AboutRoute } from "../components/AboutRoute";

export const metadata: Metadata = {
  title: "About | Marc Llobet",
  description:
    "Marc Llobet, frontend developer — bio, repositories, and how to get in touch.",
};

export default async function AboutPage() {
  const { bio, repositories } = await getPortfolioData();
  return (
    <AboutRoute bio={bio} repositories={repositories} githubUrl={GITHUB_URL} />
  );
}
