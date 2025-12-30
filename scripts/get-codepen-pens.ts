import "dotenv/config";
import { chromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import type { Pen } from "../src/services";
import { createReport } from "./common";

chromium.use(StealthPlugin());

const API_USERNAME = process.env.CODEPEN_USERNAME;

const browserContext = {
  viewport: {
    width: 1280,
    height: 720,
  },
  locale: "en-US",
  extraHTTPHeaders: {
    "accept-language": "en-US,en;q=0.9",
    referer: "https://codepen.io/",
  },
  userAgent: [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "AppleWebKit/537.36 (KHTML, like Gecko)",
    "Chrome/120.0.0.0 Safari/537.36",
  ].join(" "),
};

type PenDataResponse = {
  href: string | null;
  name: string | null;
  description: string | null;
  slug: string | null;
};

type FilteredPenData = {
  href: string;
  name: string;
  slug: string;
};

const baseUrl = `https://codepen.io/${API_USERNAME}`;

const getPenData = ({
  name,
  href,
  slug,
  description,
}: FilteredPenData & { description: string }): Pen => {
  const penData: Pen = {
    name,
    href,
    description,
    slug,
    link: `${baseUrl}/full/${slug}`,
    preview: {
      small: `${baseUrl}/pen/${slug}/image/small.png`,
      large: `${baseUrl}/pen/${slug}/image/large.png`,
    },
  };

  return penData;
};

const getCodepenPens = async (): Promise<PenDataResponse[]> => {
  const browser = await chromium.launch();
  const context = await browser.newContext(browserContext);

  const pensPage = await context.newPage();
  await pensPage.goto(
    `${baseUrl}/pens/tags/?selected_tag=demo&grid_type=list`,
    { waitUntil: "load" },
  );

  await pensPage.waitForSelector("table");

  const pensAttributes = await pensPage
    .locator("th.title a")
    .evaluateAll((anchors) =>
      anchors.map(
        (anchor) =>
          ({
            href: anchor.getAttribute("href"),
            name: anchor.textContent || null,
          }) as FilteredPenData,
      ),
    );

  await pensPage.close();

  const pens = pensAttributes.map((pen) => ({
    ...pen,
    slug: pen.href?.slice(`${baseUrl}/pens`.length) ?? null,
  }));

  const descriptions = await Promise.all(
    pens.map(async (pen) => {
      const descriptionPage = await context.newPage();
      const descriptionUrl = `${baseUrl}/details/${pen.slug}`;

      await descriptionPage.goto(descriptionUrl);

      const descriptionElement = await descriptionPage.waitForSelector(
        ":not(.about-user-info, #resources-box) > p",
        {
          state: "attached",
        },
      );

      const descriptionText = await descriptionElement.evaluate(
        (el) => el.textContent,
      );

      await descriptionPage.close();

      return descriptionText;
    }),
  );

  await browser.close();

  const filteredPens = pens.filter(
    (pen): pen is FilteredPenData => !!pen.href && !!pen.name,
  );

  const penData: PenDataResponse[] = filteredPens.map((pen, index) =>
    getPenData({
      ...pen,
      description: descriptions[index],
    }),
  );

  return penData;
};

createReport(getCodepenPens, "codepen-pens");
