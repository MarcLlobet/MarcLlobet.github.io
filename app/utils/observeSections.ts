/** A thin band near the vertical centre: a section "counts" once it crosses it. */
const ROOT_MARGIN = "-45% 0px -55% 0px";

/**
 * Watches `ids` and calls `onChange` with whichever one is currently in
 * view (the last, in document order, that's intersecting), or null above
 * the first. Shared core behind useSectionHash and useActiveSection, so the
 * address bar and the nav's own highlight agree on what "current" means.
 *
 * No-ops (and never constructs an observer) where IntersectionObserver
 * isn't available, or none of `ids` exist in the document.
 */
export const observeSections = (
  ids: string[],
  onChange: (id: string | null) => void,
): (() => void) => {
  if (typeof IntersectionObserver === "undefined") return () => {};

  const elements = ids
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);
  if (elements.length === 0) return () => {};

  const order = elements.map((el) => el.id);
  const visible = new Set<string>();

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      }
      onChange(order.filter((id) => visible.has(id)).pop() ?? null);
    },
    { rootMargin: ROOT_MARGIN },
  );

  elements.forEach((el) => observer.observe(el));
  return () => observer.disconnect();
};
