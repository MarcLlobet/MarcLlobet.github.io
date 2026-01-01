import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: ["../app/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: "@storybook/nextjs-vite",
  staticDirs: ["../app/public"],
  viteFinal: (config) => {
    config.base = "/storybook/";
    return config;
  },
};
export default config;
