import type { Pen } from "../../../scripts/get-codepen-pens";

export const codepenApi = {
  getPens: async () => {
    const response = await fetch(`/codepen-pens.json`);
    const pens: Pen[] = await response.json();
    return pens;
  },
};
