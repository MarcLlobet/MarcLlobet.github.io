/**
 * Set by CI to "/PR-<number>" for a pull request preview, empty for
 * production. NEXT_PUBLIC_ so it's inlined into the client bundle too —
 * next/link/next/image handle basePath automatically, but a few places
 * (metadata objects, a couple of plain anchors) need it by hand.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
