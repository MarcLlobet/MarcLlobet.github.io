/**
 * Inlined into the document so it runs before first paint, on every page —
 * applying the theme after hydration (as app/utils/theme.ts does) would
 * flash the wrong one first. No "use client": the root layout that embeds
 * this is a Server Component, and this is plain data, not a browser call.
 * Keep this logic matching applyPreferredTheme()/toggleTheme()'s storage
 * key ("theme") and class ("light-theme") — it can't import that module,
 * since it must run standalone before any script has loaded. Dark is the
 * default: a visitor's OS light-mode preference doesn't override it.
 */
export const THEME_INIT_SCRIPT = `
try {
  if (localStorage.getItem('theme') === 'light') {
    document.documentElement.classList.add('light-theme');
  }
} catch (e) {}
`;
