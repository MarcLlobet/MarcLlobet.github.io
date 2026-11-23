/**
 * Ids of the elements the scene reads; the page renders them. Kept in its
 * own module (no "use client", no WebGL) so importing it never pulls the
 * heavy ScrollScene component into a chunk that only needs these strings.
 */
export const SCENE = {
  heroSlot: "scene-slot-hero",
  endSlot: "scene-slot-end",
  about: "about",
  projects: "projects",
  archive: "archive",
  footer: "site-footer",
  hud: "scene-hud",
} as const;
