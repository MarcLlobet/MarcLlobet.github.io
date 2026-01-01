import type { Preview } from "@storybook/nextjs-vite";
import { GlobalStyles } from "../app/GlobalStyles";
import theme from "./theme";
import React from "react";

const preview: Preview = {
  parameters: {
    docs: {
      theme,
    },
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#424242ff" },
        { name: "light", value: "#F4F1EB" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) =>
      React.createElement(
        React.Fragment,
        null,
        React.createElement(GlobalStyles),
        React.createElement(Story),
      ),
  ],
};

export default preview;
