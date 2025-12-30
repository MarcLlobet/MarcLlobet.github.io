import type { Pen } from "../services";

export const mockPens: { queryId: string; data: Pen[] } = {
  queryId: "123",
  data: [
    {
      name: "Pen de prova",
      description: "Pen de prova",
      preview: {
        large: "large-preview.png",
        small: "small-preview.png",
      },
      href: "https://codepen.io/marc/pen-1",
      slug: "pen-1",
      link: "https://codepen.io/marc/pen-1",
    },
  ],
};
