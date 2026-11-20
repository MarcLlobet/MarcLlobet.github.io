/**
 * Mockups are small responsive pages drawn in SVG. The box has no fixed aspect
 * ratio: the mockup is drawn at the exact pixel size it gets (viewBox = W×H), so
 * it never scales or crops. Like a page layout, every measure is a percentage of
 * the box with a minimum and a maximum, `pct(W, 3.5, 12, 48)` being the CSS
 * `clamp(12px, 3.5%, 48px)`, and columns, rows and lines are recounted for each
 * size, so a wide box gets more columns and a tall one more rows.
 *
 * A mockup fills the room it is given: counts are rounded to the nearest fit and
 * the cells then stretched to the content area (the box less its page margin),
 * instead of being laid out at a fixed size and leaving a gap at the end.
 *
 * Every shape can carry an `order` (0..1): its place in the build animation that
 * plays with the scroll, and a `loop`: the animation it plays on hover.
 */

export type MockupKind =
  | "map"
  | "store"
  | "matrix"
  | "terminal"
  | "tiles"
  | "graph";

export const MOCKUP_KINDS: readonly MockupKind[] = [
  "map",
  "store",
  "matrix",
  "terminal",
  "tiles",
  "graph",
];

/** Colour roles, themed in CSS (see Mockup.styles). `acc` is the project accent. */
export type Tone = "surf" | "head" | "ink" | "bar" | "bar2" | "grey" | "acc";

/** Hover loops: pulse, lift, wave, blink, flip. */
export type Loop = "pulse" | "lift" | "wave" | "blink" | "flip";

type Motion = { order?: number; loop?: Loop };

export type Shape =
  | ({
      type: "rect";
      x: number;
      y: number;
      w: number;
      h: number;
      rx?: number;
      fill?: Tone;
      stroke?: Tone;
      strokeWidth?: number;
      opacity?: number;
    } & Motion)
  | ({
      type: "circle";
      cx: number;
      cy: number;
      r: number;
      fill: Tone;
      opacity?: number;
    } & Motion)
  | {
      type: "path";
      d: string;
      stroke: Tone;
      strokeWidth: number;
      opacity?: number;
      draw?: boolean;
    };

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

/** `percent`% of `size`, never under `min` or over `max` pixels. */
const pct = (size: number, percent: number, min: number, max: number) =>
  clamp((size * percent) / 100, min, max);

/** Small seeded generator, so a mockup looks the same on every render. */
const random = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const buildMockup = (
  kind: MockupKind,
  W: number,
  H: number,
): Shape[] => {
  const shapes: Shape[] = [];
  const r = random(kind.length * 97 + 11);
  const m = Math.min(W, H);
  /* Page metrics: margin, top bar, stroke and corner radius */
  const p = pct(W, 3.5, 12, 48);
  const nh = pct(H, 8, 22, 52);
  const sw = pct(m, 0.55, 1.5, 6);
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
  const circle = (
    cx: number,
    cy: number,
    radius: number,
    fill: Tone,
    extra: Partial<Extract<Shape, { type: "circle" }>> = {},
  ) =>
    shapes.push({
      type: "circle",
      cx,
      cy,
      r: Math.max(0, radius),
      fill,
      ...extra,
    });

  // Window chrome: background, top bar, logo and menu
  rect(0, 0, W, H, "surf");
  rect(0, 0, W, nh, "head");
  rect(p, nh * 0.36, nh * 1.6, nh * 0.28, "ink", {
    rx: nh * 0.08,
    opacity: 0.85,
  });
  for (let i = 0; i < 3; i++) {
    if (W >= 520) {
      rect(
        W - p - (3 - i) * nh * 1.9 + nh * 0.5,
        nh * 0.4,
        nh * 1.4,
        nh * 0.2,
        "bar2",
        { rx: nh * 0.1 },
      );
    } else {
      rect(
        W - p - nh * 0.7,
        nh * (0.32 + i * 0.15),
        nh * 0.7,
        nh * 0.07,
        "bar2",
      );
    }
  }

  const y0 = nh + p;
  const inner = H - y0 - p;

  if (kind === "map") {
    const gs = clamp(m / 7, 20, 80);
    for (let x = gs; x < W - 1; x += gs) rect(x, nh, 1, H - nh, "bar");
    for (let y = nh + gs; y < H - 1; y += gs) rect(0, y, W, 1, "bar");
    const dots = Math.min(500, Math.round((W * H) / 2200));
    const dr = clamp(m / 70, 2, 12);
    for (let i = 0; i < dots; i++) {
      const t = r();
      circle(
        t * W,
        nh + (H - nh) * (0.2 + t * 0.6) + (r() - 0.5) * (H - nh) * 0.35,
        dr * (0.4 + r() * 0.8),
        "acc",
        { opacity: 0.25 + r() * 0.7, order: t, loop: "pulse" },
      );
    }
    const wide = W >= 560;
    const pw = wide ? Math.min(W * 0.26, 340) : W - p * 2;
    const ph = wide ? Math.min(inner * 0.6, 260) : clamp(inner * 0.3, 56, 200);
    const py = wide ? y0 : H - p - ph;
    const lh = clamp(ph / 14, 4, 14);
    rect(p, py, pw, ph, "head", { rx });
    for (let i = 0; i < 4; i++) {
      rect(
        p + p * 0.7,
        py + p * 0.7 + (i * (ph - p * 1.4)) / 4,
        (pw - p * 1.4) * (0.45 + r() * 0.5),
        lh,
        i ? "bar2" : "ink",
        { rx: lh / 2 },
      );
    }
  }

  if (kind === "store") {
    const sh = clamp(nh * 0.8, 18, 44);
    const g = clamp(m / 40, 8, 32);
    rect(p, y0, Math.min(W - p * 2, 720), sh, "bar", { rx: sh / 2 });
    const top = y0 + sh + g * 1.5;
    const gridH = H - p - top;
    const cols = clamp(Math.round((W - p * 2 + g) / 230), 1, 6);
    const cw = (W - p * 2 - g * (cols - 1)) / cols;
    /* As many rows of near-portrait cards as fit, stretched to fill the grid */
    const rows = Math.max(1, Math.round((gridH + g) / (cw * 1.2 + g)));
    const ch = (gridH - g * (rows - 1)) / rows;
    // Too little room for a card: leave the search bar alone
    for (let j = 0; ch >= 24 && j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const cx = p + i * (cw + g);
        const cy = top + j * (ch + g);
        const phh = ch * 0.55;
        const pww = Math.min(phh * 0.5, cw * 0.5);
        const k = (j * cols + i) / (rows * cols);
        rect(cx, cy, cw, ch, "head", { rx, order: k });
        outline(cx + cw / 2 - pww / 2, cy + ch * 0.1, pww, phh, "acc", {
          rx: pww * 0.16,
          order: k + 0.05,
          loop: "lift",
        });
        rect(
          cx + cw * 0.1,
          cy + ch * 0.74,
          cw * 0.6,
          clamp(ch / 24, 4, 14),
          "ink",
          {
            rx: rx / 2,
            opacity: 0.8,
            order: k + 0.08,
          },
        );
        rect(
          cx + cw * 0.1,
          cy + ch * 0.74 + clamp(ch / 12, 8, 28),
          cw * 0.3,
          clamp(ch / 28, 3, 12),
          "bar2",
          { rx: rx / 2, order: k + 0.1 },
        );
      }
    }
  }

  if (kind === "matrix") {
    const th = clamp(nh * 0.5, 10, 28);
    rect(p, y0, Math.min(W * 0.4, 520), th, "ink", {
      rx: rx / 2,
      opacity: 0.85,
    });
    const top = y0 + th + p;
    /* Square-ish cells that divide the room exactly, so the grid fills it */
    const target = clamp(m / 14, 10, 44);
    const availW = W - p * 2;
    const availH = H - p - top;
    const cols = Math.max(1, Math.round(availW / target));
    const cw = availW / cols;
    const rows = Math.max(1, Math.round(availH / cw));
    const chh = availH / rows;
    const gap = Math.min(cw, chh) * 0.14;
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const o = r();
        rect(p + i * cw, top + j * chh, cw - gap, chh - gap, "acc", {
          rx: cw * 0.12,
          opacity: 0.06 + o * o * 0.94,
          order: (i * rows + j) / (cols * rows),
          loop: "wave",
        });
      }
    }
  }

  if (kind === "terminal") {
    const tw = W - p * 2;
    rect(p, y0, tw, inner, "head", { rx: rx * 1.5 });
    const dot = clamp(m / 90, 3, 9);
    for (let i = 0; i < 3; i++) {
      circle(
        p + p * 0.6 + dot + i * dot * 3.4,
        y0 + p * 0.6 + dot,
        dot,
        "bar2",
      );
    }
    const lead = clamp(m / 16, 14, 40);
    const lh = lead * 0.45;
    const ly0 = y0 + p * 0.6 + dot * 2 + lead * 0.8;
    /* Lines spread over the whole panel instead of stopping short of it */
    const room = y0 + inner - p * 0.6 - ly0;
    const count = Math.max(1, Math.round(room / lead));
    const step = room / count;
    for (let i = 0; i < count; i++) {
      const hit = i % 4 === 3;
      const ly = ly0 + i * step;
      const loop: Loop | undefined = hit ? "blink" : undefined;
      rect(p + p * 0.6, ly, lh, lh, hit ? "acc" : "grey", {
        rx: lh * 0.15,
        order: i / count,
        loop,
      });
      rect(
        p + p * 0.6 + lh * 2,
        ly + lh * 0.1,
        (tw - p * 1.2 - lh * 2) * (0.25 + r() * 0.6),
        lh * 0.8,
        hit ? "acc" : "bar2",
        {
          rx: lh * 0.4,
          opacity: hit ? 0.9 : undefined,
          order: i / count + 0.03,
          loop,
        },
      );
    }
  }

  if (kind === "tiles") {
    const gap = clamp(m / 80, 3, 14);
    /* The board is as many square-ish tiles as the box takes, edge to edge */
    const target = clamp(m / 6, 40, 130);
    const cols = clamp(Math.round((W - p * 2) / target), 2, 9);
    const tw = (W - p * 2) / cols;
    const rows = clamp(Math.round(inner / tw), 2, 12);
    const thh = inner / rows;
    const played = Math.max(1, Math.round(rows * 0.68));
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const x = p + i * tw;
        const y = y0 + j * thh;
        const order = (j * cols + i) / (rows * cols);
        const rx = Math.min(tw, thh) * 0.08;
        if (j < played) {
          const q = r();
          rect(
            x,
            y,
            tw - gap,
            thh - gap,
            q > 0.66 ? "acc" : q > 0.4 ? "grey" : "bar",
            { rx, order, loop: "flip" },
          );
        } else {
          outline(
            x + sw / 2,
            y + sw / 2,
            tw - gap - sw,
            thh - gap - sw,
            "bar2",
            { rx, order },
          );
        }
      }
    }
  }

  if (kind === "graph") {
    /* The branch spans the whole height: the first and last nodes are its ends */
    const count = Math.max(2, Math.round(inner / clamp(inner / 8, 18, 80)));
    const st = inner / (count - 1);
    const gx = p + st * 0.8;
    const radius = clamp(st * 0.16, 3, 16);
    const br = st * 1.1;
    const gy0 = y0;
    rect(gx - sw, gy0, sw * 2, (count - 1) * st, "bar2");
    if (count >= 5) {
      shapes.push({
        type: "path",
        d: `M ${gx} ${gy0 + st} C ${gx + br} ${gy0 + st}, ${gx + br} ${gy0 + st * 1.5}, ${gx + br} ${gy0 + st * 2} L ${gx + br} ${gy0 + st * 3} S ${gx} ${gy0 + st * 4}, ${gx} ${gy0 + st * 4}`,
        stroke: "acc",
        strokeWidth: sw * 1.4,
        opacity: 0.7,
        draw: true,
      });
    }
    for (let i = 0; i < count; i++) {
      const y = gy0 + i * st;
      const side = count >= 5 && (i === 2 || i === 3);
      const x = side ? gx + br : gx;
      circle(x, y, radius, side ? "acc" : "ink", {
        order: i / count,
        loop: "pulse",
      });
      rect(
        x + radius * 3,
        y - radius * 0.6,
        (W - x - radius * 3 - p) * (0.35 + r() * 0.6),
        radius * 1.2,
        i % 3 === 0 ? "ink" : "bar2",
        {
          rx: radius * 0.6,
          opacity: i % 3 === 0 ? 0.85 : undefined,
          order: i / count + 0.04,
        },
      );
    }
  }

  return shapes;
};
