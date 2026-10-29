/**
 * Layout regression check.
 *
 * Serves the static export in `out/`, opens it in Chromium at a set of
 * real-world viewports and reports layout problems that are easy to miss
 * when you only look at the site on your own screen:
 *
 * - horizontal overflow (the page can be scrolled sideways)
 * - elements that stick out of the viewport
 * - project sections whose content spills out of the section
 * - projects that do not fit in one screen
 * - the hero name colliding with the rotating shape
 * - tap targets smaller than 24×24px (WCAG 2.2 AA)
 *
 * Usage:
 *   pnpm build && pnpm check:layout            # fails on problems
 *   pnpm check:layout --report-only            # just writes the report
 *
 * Screenshots and a report are written to `layout-report/`.
 */
import { createServer, type Server } from "node:http";
import { readFile, mkdir, writeFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { chromium, type Page } from "playwright";

const OUT_DIR = "out";
const REPORT_DIR = "layout-report";
const REPORT_ONLY = process.argv.includes("--report-only");

type Viewport = { name: string; width: number; height: number };

const VIEWPORTS: Viewport[] = [
  { name: "phone-xs", width: 320, height: 568 },
  { name: "phone-android", width: 360, height: 740 },
  { name: "phone-iphone", width: 390, height: 844 },
  { name: "phone-landscape", width: 844, height: 390 },
  { name: "phone-se-landscape", width: 667, height: 375 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "tablet-landscape", width: 1024, height: 768 },
  { name: "laptop", width: 1280, height: 800 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "desktop-fhd", width: 1920, height: 1080 },
];

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
};

const isFile = async (path: string) => {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
};

const serve = (): Promise<{ server: Server; url: string }> =>
  new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      const pathname = decodeURIComponent(
        new URL(req.url ?? "/", "http://localhost").pathname,
      );
      const base = join(OUT_DIR, normalize(pathname));
      const candidates = [base, `${base}.html`, join(base, "index.html")];
      for (const candidate of candidates) {
        if (await isFile(candidate)) {
          res.writeHead(200, {
            "content-type":
              MIME[extname(candidate)] ?? "application/octet-stream",
          });
          res.end(await readFile(candidate));
          return;
        }
      }
      res.writeHead(404).end("Not found");
    });
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      resolve({ server, url: `http://127.0.0.1:${port}` });
    });
  });

type Problem = { check: string; detail: string };

/** Runs in the browser. Keep it self-contained. */
const inspectPage = () => {
  const problems: { check: string; detail: string }[] = [];
  const doc = document.documentElement;
  const viewportWidth = doc.clientWidth;

  const describe = (el: Element) => {
    const id = el.id ? `#${el.id}` : "";
    const testId = el.getAttribute("data-testid");
    return `${el.tagName.toLowerCase()}${id}${testId ? `[${testId}]` : ""}`;
  };

  const isVisible = (el: Element) => {
    const style = getComputedStyle(el);
    if (style.visibility === "hidden" || style.display === "none") {
      return false;
    }
    for (let node: Element | null = el; node; node = node.parentElement) {
      if (getComputedStyle(node).opacity === "0") return false;
    }
    return true;
  };

  if (doc.scrollWidth > viewportWidth + 1) {
    problems.push({
      check: "horizontal-overflow",
      detail: `page is ${doc.scrollWidth}px wide in a ${viewportWidth}px viewport`,
    });
  }

  const outside = new Set<string>();
  for (const el of document.body.querySelectorAll("*")) {
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height || !isVisible(el)) continue;
    if (rect.right > viewportWidth + 1 || rect.left < -1) {
      outside.add(
        `${describe(el)} (${Math.round(rect.left)}→${Math.round(rect.right)}px)`,
      );
    }
  }
  if (outside.size) {
    problems.push({
      check: "outside-viewport",
      detail: [...outside].slice(0, 6).join(", "),
    });
  }

  const viewportHeight = window.innerHeight;
  const tooTall = [...document.querySelectorAll(".page-section")]
    .filter(
      (section) => section.getBoundingClientRect().height > viewportHeight + 1,
    )
    .map((section) => `#${section.id}`);
  if (tooTall.length) {
    problems.push({
      check: "one-screen",
      detail: `${tooTall.length} project(s) taller than the screen: ${tooTall.slice(0, 4).join(", ")}`,
    });
  }

  for (const section of document.querySelectorAll(".page-section")) {
    const sectionRect = section.getBoundingClientRect();
    for (const child of section.querySelectorAll("h2, img, p")) {
      const rect = child.getBoundingClientRect();
      if (!rect.width || !rect.height) continue;
      if (
        rect.bottom > sectionRect.bottom + 1 ||
        rect.top < sectionRect.top - 1
      ) {
        problems.push({
          check: "section-overflow",
          detail: `#${section.id}: ${describe(child)} spills out of its section`,
        });
        break;
      }
    }
  }

  const name = document.querySelector("hgroup h1");
  if (name) {
    const hero = name.closest("hgroup")!.getBoundingClientRect();
    for (const line of name.children) {
      const rect = line.getBoundingClientRect();
      if (rect.right > hero.right + 1 || rect.right > viewportWidth + 1) {
        problems.push({
          check: "hero-name",
          detail: `"${line.textContent}" (${Math.round(rect.width)}px) does not fit in the hero (${Math.round(hero.width)}px)`,
        });
      }
    }
    const shape = document.querySelector("[data-testid='hero-shape'] svg");
    if (shape) {
      const a = name.getBoundingClientRect();
      const b = shape.getBoundingClientRect();
      const overlaps =
        a.left < b.right &&
        b.left < a.right &&
        a.top < b.bottom &&
        b.top < a.bottom;
      if (overlaps) {
        problems.push({
          check: "hero-overlap",
          detail: "the hero name overlaps the rotating shape",
        });
      }
    }
  }

  // Only touch screens need big targets (WCAG 2.2 AA asks for 24×24px).
  const isTouch = matchMedia("(pointer: coarse)").matches;
  const small: string[] = [];
  const targets = isTouch
    ? document.querySelectorAll("nav a, nav button, aside a")
    : [];
  for (const el of targets) {
    const rect = el.getBoundingClientRect();
    if (rect.width < 24 || rect.height < 24) {
      small.push(
        `${el.textContent?.trim() || el.getAttribute("aria-label")} (${Math.round(rect.width)}×${Math.round(rect.height)})`,
      );
    }
  }
  if (small.length) {
    problems.push({
      check: "tap-target",
      detail: `${small.length} targets under 24×24px, e.g. ${small.slice(0, 3).join(", ")}`,
    });
  }

  return problems;
};

const settle = (page: Page, ms = 400) => page.waitForTimeout(ms);

const run = async () => {
  const { server, url } = await serve();
  const browser = await chromium.launch();
  await mkdir(REPORT_DIR, { recursive: true });

  const results: { viewport: Viewport; problems: Problem[] }[] = [];

  for (const viewport of VIEWPORTS) {
    const isPhone = Math.min(viewport.width, viewport.height) < 600;
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      isMobile: isPhone,
      hasTouch: isPhone,
    });
    // tsx/esbuild may wrap functions with a `__name` helper that does not
    // exist inside the browser, so provide a no-op one.
    await context.addInitScript("window.__name = (fn) => fn;");
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    // The name animates its weight and the projects fade in after 2s.
    await settle(page, 2600);

    const problems = await page.evaluate(inspectPage);
    await page.screenshot({
      path: `${REPORT_DIR}/${viewport.name}-1-home.png`,
    });

    const sectionTops = await page.$$eval(".page-section", (sections) =>
      sections.map((s) => (s as HTMLElement).offsetTop),
    );
    for (const [index, top] of sectionTops.slice(0, 2).entries()) {
      await page.evaluate((y) => window.scrollTo({ top: y }), top);
      await settle(page);
      await page.screenshot({
        path: `${REPORT_DIR}/${viewport.name}-${index + 2}-section.png`,
      });
    }

    const about = page.getByRole("button", { name: "About" });
    await about.hover().catch(() => undefined);
    await about.click();
    await settle(page, 600);
    const aboutCut = await page.evaluate(() => {
      const dialog = document.querySelector("[role='dialog']");
      if (!dialog) return false;
      const overflows = dialog.scrollHeight > dialog.clientHeight + 1;
      const scrolls = ["auto", "scroll"].includes(
        getComputedStyle(dialog).overflowY,
      );
      return overflows && !scrolls;
    });
    if (aboutCut) {
      problems.push({
        check: "about-overflow",
        detail: "the About text is taller than the screen and cannot scroll",
      });
    }
    await page.screenshot({
      path: `${REPORT_DIR}/${viewport.name}-4-about.png`,
    });

    results.push({ viewport, problems });
    await context.close();
  }

  await browser.close();
  server.close();

  const lines = ["# Layout report", ""];
  for (const { viewport, problems } of results) {
    const size = `${viewport.width}×${viewport.height}`;
    lines.push(
      `## ${problems.length ? "❌" : "✅"} ${viewport.name} (${size})`,
      ...problems.map((p) => `- **${p.check}**: ${p.detail}`),
      "",
    );
  }
  const report = lines.join("\n");
  await writeFile(`${REPORT_DIR}/report.md`, report);
  await writeFile(
    `${REPORT_DIR}/report.json`,
    JSON.stringify(results, null, 2),
  );
  console.log(report);

  const failed = results.some((r) => r.problems.length);
  if (failed && !REPORT_ONLY) {
    console.error("Layout check failed. See layout-report/ for screenshots.");
    process.exit(1);
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
