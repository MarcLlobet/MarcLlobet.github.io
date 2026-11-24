/**
 * Ids of the elements the scene reads; the page renders them. Kept in its
 * own module (no "use client", no WebGL) so importing it never pulls the
 * heavy ScrollScene component into a chunk that only needs these strings.
 */
export const SCENE_SLOT_HERO = "scene-slot-hero";
export const SCENE_SLOT_END = "scene-slot-end";
export const HERO = "hero";
export const PROJECTS = "projects";
export const ARCHIVE = "archive";
export const META = "meta";
export const SITE_FOOTER = "site-footer";
export const SCENE_HUD = "scene-hud";
