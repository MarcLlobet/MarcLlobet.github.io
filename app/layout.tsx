import type { Metadata } from "next";
import StyledComponentsRegistry from "./registry";
import { GlobalStyles } from "./GlobalStyles";

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
  metadataBase: new URL("https://marcllobet.github.io"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://marcllobet.github.io",
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
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon-red.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <GlobalStyles />
          <div id="root">{children}</div>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
