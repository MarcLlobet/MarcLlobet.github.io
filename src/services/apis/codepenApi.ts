import { apiFetch } from "./apiFetch";

type Pen = {
  name: string;
  href: string;
  description: string;
  slug: string;
  link: string;
  preview: {
    large: string;
    small: string;
  };
};

export type CodepenTypes = {
  Pen: Pen;
};

export const codepenApi = {
  getPens: () => apiFetch<Pen[]>("/data/codepen-pens.json"),
};
