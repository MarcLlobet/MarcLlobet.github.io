import type { Metadata } from "next";
import { getPortfolioData } from "../data/github";
import { GITHUB_URL } from "../constants";
import { AboutRoute } from "../components/AboutRoute";

const TITLE = "About | Marc Llobet";
const DESCRIPTION =
  "Marc Llobet, frontend developer — bio, repositories, and how to get in touch.";

/*
 * title/description alone only set <title> and <meta name="description">.
 * Next doesn't copy those into openGraph/twitter from a page's own export,
 * so without this a shared /about link would show the root layout's home
 * page preview card instead — wrong title, wrong description, wrong URL.
 */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // Relative (no leading slash): resolved against the root layout's
  // metadataBase, which already carries the PR-preview basePath if any —
  // a leading-slash string would resolve from the domain root instead and
  // silently drop a preview's /PR-123 segment.
  alternates: { canonical: "about" },
  openGraph: {
    type: "profile",
    url: "about",
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Marc Llobet Portfolio",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default async function AboutPage() {
  const { bio, repositories } = await getPortfolioData();
  return (
    <AboutRoute bio={bio} repositories={repositories} githubUrl={GITHUB_URL} />
  );
}
