import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPortfolioData } from "../../data/github";
import { accentFor, displayName, splitDescription } from "../../utils/projects";
import { mockupFor } from "../../mockups";
import { ProjectContent } from "../../components/ProjectContent";

type Params = { name: string };

export async function generateStaticParams(): Promise<Params[]> {
  const { repositories } = await getPortfolioData();
  return repositories.map(({ name }) => ({ name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { name } = await params;
  const { repositories } = await getPortfolioData();
  const repository = repositories.find((repo) => repo.name === name);
  if (!repository) return {};

  const title = `${displayName(repository.name)} | Marc Llobet`;
  const { tagline } = splitDescription(repository.description);

  return {
    title,
    description: tagline,
    // Relative (no leading slash): resolved against the root layout's
    // metadataBase, which already carries a PR preview's basePath if any.
    alternates: { canonical: `projects/${name}` },
    openGraph: {
      type: "website",
      url: `projects/${name}`,
      title,
      description: tagline,
      siteName: "Marc Llobet Portfolio",
      images: repository.preview ? [repository.preview] : undefined,
    },
    twitter: {
      card: repository.preview ? "summary_large_image" : "summary",
      title,
      description: tagline,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { name } = await params;
  const { repositories } = await getPortfolioData();
  const index = repositories.findIndex((repo) => repo.name === name);
  if (index === -1) notFound();
  const repository = repositories[index];

  return (
    <ProjectContent
      repository={repository}
      accent={accentFor(index)}
      kind={mockupFor(repository)}
    />
  );
}
