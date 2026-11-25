import type { Shape, Tone } from "../../mockups";

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

/** `percent`% of `size`, never under `min` or over `max` pixels. */
const pct = (size: number, percent: number, min: number, max: number) =>
  clamp((size * percent) / 100, min, max);

export type PipelineKind = "api" | "checks" | "ssg" | "deploy";

/**
 * Four small drawings for the Meta section's build pipeline, sharing every
 * low-level convention a project's own mockup does (buildMockup, in
 * app/mockups/shapes.ts) — margin/stroke/corner metrics, the Tone palette,
 * one accent highlight per drawing — but not all the same outer chrome:
 * a browser window only actually fits "deploy" (the step that ends up
 * viewed in one). The other three get the frame their own content is:
 *  - api: no chrome at all, just a bracket (the shape of a request) and a
 *    few data lines straight on the background.
 *  - checks: the same dark panel + corner dots the "terminal" mockup kind
 *    itself uses, filling the whole box instead of sitting inside a
 *    browser window — a short checklist, ticks with one miss.
 *  - ssg: an outlined package (a box with a seam line, not a window) —
 *    the same bracket feeding into a grid of solid cells, data in,
 *    pre-rendered pixels out.
 *  - deploy: the actual browser chrome — a package with an arrow rising
 *    out of it, the thing that gets deployed and viewed.
 */
export const buildPipelineIcon = (
  kind: PipelineKind,
  W: number,
  H: number,
): Shape[] => {
  const shapes: Shape[] = [];
  const m = Math.min(W, H);
  const p = pct(W, 3.5, 10, 40);
  const sw = pct(m, 0.7, 1.5, 5);
  const rx = pct(m, 1.1, 2, 10);

  const rect = (
    x: number,
    y: number,
    w: number,
    h: number,
    fill: Tone,
    extra: Partial<Extract<Shape, { type: "rect" }>> = {},
  ) =>
    shapes.push({
      type: "rect",
      x,
      y,
      w: Math.max(0, w),
      h: Math.max(0, h),
      fill,
      ...extra,
    });

  const outline = (
    x: number,
    y: number,
    w: number,
    h: number,
    stroke: Tone,
    extra: Partial<Extract<Shape, { type: "rect" }>> = {},
  ) =>
    shapes.push({
      type: "rect",
      x,
      y,
      w: Math.max(0, w),
      h: Math.max(0, h),
      stroke,
      strokeWidth: sw,
      ...extra,
    });

  const circle = (cx: number, cy: number, radius: number, fill: Tone) =>
    shapes.push({ type: "circle", cx, cy, r: Math.max(0, radius), fill });

  rect(0, 0, W, H, "surf");

  /* Each kind gets the content area (y0/innerW/innerH/cy) its own chrome
   * leaves behind, instead of every icon assuming the same browser header. */
  let y0 = p;
  let innerW = W - p * 2;
  let innerH = H - p * 2;

  if (kind === "deploy") {
    /* The one browser window: header, logo chip, three menu dots — the
     * exact chrome every project's own mockup draws. */
    const nh = pct(H, 8, 20, 48);
    rect(0, 0, W, nh, "head");
    rect(p, nh * 0.36, nh * 1.6, nh * 0.28, "ink", {
      rx: nh * 0.08,
      opacity: 0.85,
    });
    for (let i = 0; i < 3; i++) {
      rect(
        W - p - nh * 0.7,
        nh * (0.32 + i * 0.15),
        nh * 0.7,
        nh * 0.07,
        "bar2",
      );
    }
    y0 = nh + p;
    innerH = H - y0 - p;
  } else if (kind === "checks") {
    /* The terminal mockup kind's own panel-plus-corner-dots, filling the
     * whole box — a terminal, not a window it sits inside. */
    const panelY = p * 0.5;
    const panelH = H - panelY - p * 0.5;
    rect(p * 0.5, panelY, innerW, panelH, "head", { rx: rx * 1.5 });
    const dot = clamp(m / 24, 2.5, 7);
    for (let i = 0; i < 3; i++) {
      circle(p + dot + i * dot * 2.8, panelY + dot * 1.8, dot * 0.6, "bar2");
    }
    y0 = panelY + dot * 3.4;
    innerH = panelY + panelH - y0 - dot;
    innerW = innerW - p;
  } else if (kind === "ssg") {
    /* A package, not a window: an outlined box with a seam line standing
     * in for the fold of a flap, nothing filled behind it. */
    const boxY = p * 0.6;
    const boxH = H - boxY - p * 0.6;
    outline(p * 0.6, boxY, innerW, boxH, "bar2", { rx });
    const seamY = boxY + boxH * 0.3;
    rect(p * 0.6, seamY, innerW, Math.max(1, sw * 0.8), "bar2");
    y0 = seamY + p * 0.5;
    innerH = boxY + boxH - y0 - p * 0.3;
  }

  const cy = y0 + innerH / 2;

  /* A simplified "{" — a vertical stroke with a short tooth at the
   * mid-point and arms top and bottom — shared by "api" and "ssg" so the
   * same data shape visibly carries through both. */
  const bracket = (
    bx: number,
    by: number,
    bw: number,
    bh: number,
    tone: Tone,
  ) => {
    const bt = Math.max(1.4, sw);
    rect(bx, by, bw * 0.55, bt, tone, { rx: bt / 2 });
    rect(bx, by + bh - bt, bw * 0.55, bt, tone, { rx: bt / 2 });
    rect(bx, by, bt, bh, tone, { rx: bt / 2 });
    rect(bx + bw * 0.4, by + bh / 2 - bt / 2, bw * 0.6, bt, tone, {
      rx: bt / 2,
    });
  };

  if (kind === "api") {
    const bw = innerW * 0.22;
    const bh = innerH * 0.7;
    const bx = p;
    const by = cy - bh / 2;
    bracket(bx, by, bw, bh, "acc");

    const lx = bx + bw + innerW * 0.14;
    const lw = innerW - bw - innerW * 0.14;
    const lh = clamp(innerH / 10, 3, 10);
    for (let i = 0; i < 3; i++) {
      rect(
        lx,
        by + (i * bh) / 2.6,
        lw * (0.55 + (i % 2) * 0.3),
        lh,
        i === 0 ? "ink" : "bar2",
        { rx: lh / 2, order: i / 3 },
      );
    }
  }

  if (kind === "checks") {
    const rows = 3;
    const rh = innerH / rows;
    for (let i = 0; i < rows; i++) {
      const ry = y0 + i * rh + rh / 2;
      const mark = clamp(rh * 0.3, 4, 14);
      const fail = i === rows - 1;
      shapes.push({
        type: "path",
        d: fail
          ? `M${p} ${ry - mark / 2} L${p + mark} ${ry + mark / 2} M${p + mark} ${ry - mark / 2} L${p} ${ry + mark / 2}`
          : `M${p} ${ry} L${p + mark * 0.4} ${ry + mark * 0.4} L${p + mark} ${ry - mark * 0.5}`,
        stroke: fail ? "bar2" : "acc",
        strokeWidth: sw * 1.2,
      });
      const lh = clamp(rh / 8, 2, 6);
      rect(
        p + mark * 1.9,
        ry - lh / 2,
        innerW - mark * 1.9 - innerW * 0.08,
        lh,
        fail ? "bar2" : "bar",
        { rx: lh / 2, order: i / rows },
      );
    }
  }

  if (kind === "ssg") {
    const halfW = innerW * 0.4;
    const bw = halfW * 0.55;
    const bh = innerH * 0.6;
    const bx = p;
    const by = cy - bh / 2;
    bracket(bx, by, bw, bh, "bar2");

    const gx0 = p + halfW + innerW * 0.14;
    const gw = innerW - halfW - innerW * 0.14;
    const cols = 3;
    const rows = 2;
    const gap = clamp(m / 40, 1, 4);
    const cw = (gw - gap * (cols - 1)) / cols;
    const ch = (innerH * 0.7 - gap * (rows - 1)) / rows;
    const gy0 = cy - (ch * rows + gap * (rows - 1)) / 2;
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const idx = j * cols + i;
        const isAccent = idx === 2;
        rect(
          gx0 + i * (cw + gap),
          gy0 + j * (ch + gap),
          cw,
          ch,
          isAccent ? "acc" : "ink",
          {
            rx: cw * 0.15,
            opacity: isAccent ? undefined : 0.75,
            order: idx / (cols * rows),
          },
        );
      }
    }
  }

  if (kind === "deploy") {
    const bw = innerW * 0.46;
    const bh = innerH * 0.4;
    const bx = (W - bw) / 2;
    const by = y0 + innerH - bh;
    rect(bx, by, bw, bh, "bar2", { rx: rx * 0.6 });
    rect(bx, by + bh * 0.42, bw, Math.max(1, sw * 0.8), "surf");

    const ax = W / 2;
    const ah = innerH * 0.5;
    const ay0 = by - innerH * 0.1;
    shapes.push({
      type: "path",
      d: `M${ax} ${ay0} L${ax} ${ay0 - ah} M${ax - ah * 0.35} ${ay0 - ah * 0.62} L${ax} ${ay0 - ah} L${ax + ah * 0.35} ${ay0 - ah * 0.62}`,
      stroke: "acc",
      strokeWidth: sw * 1.2,
    });
  }

  return shapes;
};
