/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { execSync } from "node:child_process";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [
    {
      name: "run-codepen-pens-script",
      async buildStart() {
        execSync("tsx scripts/get-codepen-pens.ts", {
          stdio: "inherit",
          env: {
            ...process.env,
            CODEPEN_USERNAME: process.env.CODEPEN_USERNAME,
          },
        });
      },
    },
    {
      name: "run-github-repos-script",
      async buildStart() {
        execSync("tsx scripts/get-github-repos.ts", {
          stdio: "inherit",
          env: {
            ...process.env,
            GH_API_TOKEN: process.env.GH_API_TOKEN,
            GH_API_USERNAME: process.env.GH_API_USERNAME,
          },
        });
      },
    },
    {
      name: "run-github-bio-script",
      async buildStart() {
        execSync("tsx scripts/get-github-bio.ts", {
          stdio: "inherit",
          env: {
            ...process.env,
            GH_API_TOKEN: process.env.GH_API_TOKEN,
            GH_API_USERNAME: process.env.GH_API_USERNAME,
          },
        });
      },
    },
    react(),
  ],
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
