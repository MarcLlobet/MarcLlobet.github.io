import type { Metadata } from "next";
import Link from "next/link";
import StyledComponentsRegistry from "./registry";
import { GlobalStyles } from "./GlobalStyles";
import { spaceGrotesk, jetbrainsMono } from "./fonts";
import { THEME_INIT_SCRIPT } from "./theme-init-script";
import { BASE_PATH } from "./base-path";
import { NavWrapper } from "./components/NavWrapper";
import { PageReveal } from "./components/PageReveal";
import { LazyCursorFollower } from "./components/Shell/LazyCursorFollower";
import { Page, Header, Brand } from "./components/Shell/Shell.styles";
import { copy } from "./content/copy";

/*
 * metadataBase needs a trailing slash: Next resolves a relative metadata URL
 * (e.g. a "projects/<name>" string on a page's own metadata) against it, and
 * a base without one drops the last path segment per normal URL-resolution
 * rules — which would silently lose a PR preview's /PR-123 segment.
 */
const metadataBase = new URL(`https://marcllobet.github.io${BASE_PATH}/`);
const isPreview = BASE_PATH !== "";

export const metadata: Metadata = {
  title: copy["meta.siteTitle"],
  description: copy["meta.siteDescription"],
  keywords: copy["meta.keywords"],
  authors: [{ name: copy["brand.name"] }],
  creator: copy["brand.name"],
  metadataBase,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: ".",
    title: copy["meta.siteTitle"],
    description: copy["meta.ogDescription"],
    siteName: copy["meta.siteName"],
  },
  twitter: {
    card: "summary_large_image",
    title: copy["meta.siteTitle"],
    description: copy["meta.ogDescription"],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
                  {copy["brand.name"]}
                </Brand>
                <NavWrapper />
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
