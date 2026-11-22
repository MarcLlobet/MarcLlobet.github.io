import localFont from "next/font/local";

/*
 * next/font self-hosts, preloads with the correct `crossorigin`, and —
 * unlike a hand-written @font-face — computes a fallback font sized to
 * match this font's own metrics, so the page doesn't reflow once the real
 * font swaps in.
 */
export const spaceGrotesk = localFont({
  src: "./public/fonts/space-grotesk/SpaceGrotesk-Variable.woff2",
  weight: "300 700",
  variable: "--font-sans",
  display: "swap",
});

export const jetbrainsMono = localFont({
  src: "./public/fonts/jetbrains-mono/JetBrainsMono-Variable.woff2",
  weight: "100 800",
  variable: "--font-mono",
  display: "swap",
});
