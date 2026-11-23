import type { Metadata } from "next";
import Link from "next/link";
import StyledComponentsRegistry from "./registry";
import { GlobalStyles } from "./GlobalStyles";
import { spaceGrotesk, jetbrainsMono } from "./fonts";
import { THEME_INIT_SCRIPT } from "./theme-init-script";
import { BASE_PATH } from "./base-path";
import { getPortfolioData } from "./data/github";
import { selectProjects } from "./utils/projects";
import { NavWrapper } from "./components/NavWrapper";
import { PageReveal } from "./components/PageReveal";
import { LazyCursorFollower } from "./components/Shell/LazyCursorFollower";
import { Page, Header, Brand } from "./components/Shell/Shell.styles";

/*
 * metadataBase needs a trailing slash: Next resolves a relative metadata URL
 * (e.g. an "about" string on a page's own metadata) against it, and a base
 * without one drops the last path segment per normal URL-resolution rules —
 * which would silently lose a PR preview's /PR-123 segment.
 */
const metadataBase = new URL(`https://marcllobet.github.io${BASE_PATH}/`);
const isPreview = BASE_PATH !== "";

export const metadata: Metadata = {
  title: "Marc Llobet | Frontend Developer",
  description:
    "Portfolio of Marc Llobet, a frontend developer specializing in React, TypeScript, and modern web technologies. View my projects and get in touch.",
  keywords: [
    "frontend developer",
    "React",
    "TypeScript",
    "web developer",
    "portfolio",
    "Marc Llobet",
  ],
  authors: [{ name: "Marc Llobet" }],
  creator: "Marc Llobet",
  metadataBase,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: ".",
    title: "Marc Llobet | Frontend Developer",
    description:
      "Portfolio of Marc Llobet, a frontend developer specializing in React, TypeScript, and modern web technologies.",
    siteName: "Marc Llobet Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marc Llobet | Frontend Developer",
    description:
      "Portfolio of Marc Llobet, a frontend developer specializing in React, TypeScript, and modern web technologies.",
  },
  // A PR preview shouldn't show up in search results.
  robots: {
    index: !isPreview,
    follow: !isPreview,
  },
  icons: {
    icon: `${BASE_PATH}/favicon.svg`,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { repositories, pinned } = await getPortfolioData();
  const { archive } = selectProjects(repositories, pinned);

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <script
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
          suppressHydrationWarning
        />
        <StyledComponentsRegistry>
          <GlobalStyles />
          <div id="root">
            <Page>
              <Header>
                <Brand as={Link} href="/">
                  Marc Llobet
                </Brand>
                <NavWrapper hasArchive={archive.length > 0} />
              </Header>
              <PageReveal>{children}</PageReveal>
            </Page>
            <LazyCursorFollower />
          </div>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
