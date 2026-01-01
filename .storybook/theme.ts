import { create } from "storybook/theming";

export default create({
  base: "dark",

  // Brand
  brandTitle: "MLL Design System",
  brandUrl: "/",
  brandTarget: "_self",
  brandImage: "/storybook-logo.svg",

  // Colors
  colorPrimary: "#B0483A",
  colorSecondary: "#B0483A",

  // UI
  appBg: "#1a1b1f",
  appContentBg: "#1a1b1f",
  appPreviewBg: "#141518",
  appBorderColor: "#2a2b30",
  appBorderRadius: 8,

  // Text colors
  textColor: "#D1CDC4",
  textInverseColor: "#141518",
  textMutedColor: "#8E8A80",

  // Toolbar default and active colors
  barTextColor: "#8E8A80",
  barSelectedColor: "#B0483A",
  barHoverColor: "#B0483A",
  barBg: "#141518",

  // Form colors
  inputBg: "#1a1b1f",
  inputBorder: "#2a2b30",
  inputTextColor: "#D1CDC4",
  inputBorderRadius: 4,

  // Button
  buttonBg: "#B0483A",
  buttonBorder: "#B0483A",

  // Boolean
  booleanBg: "#1a1b1f",
  booleanSelectedBg: "#B0483A",

  // Font
  fontBase:
    "'Satoshi', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  fontCode: "monospace",
});
