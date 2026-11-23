"use client";

import dynamic from "next/dynamic";

/*
 * next/dynamic's ssr:false option only works from a Client Component — the
 * root layout is a Server Component (it fetches portfolio data), so this
 * tiny wrapper is where that option actually lives.
 */
export const LazyCursorFollower = dynamic(
  () =>
    import("../CursorFollower").then((mod) => ({
      default: mod.CursorFollower,
    })),
  { ssr: false },
);
