import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProjectSearch } from "./ProjectSearch";
import { buildSearchTree } from "../../lib/search";
import { repositoryText } from "../../lib/search/repositories";
import { mockRepos } from "../../mocks/repos";
import type { Repository } from "../../types";

const repositories: Repository[] = [
  ...mockRepos,
  {
    ...mockRepos[0]!,
    id: "3",
    name: "image-gallery",
    description: "Infinite scroll",
    primaryLanguage: { name: "JavaScript" },
    languages: [{ name: "JavaScript" }],
  },
  {
    ...mockRepos[0]!,
    id: "4",
    name: "ts-only",
    description: "Fails on JavaScript files",
    languages: [{ name: "TypeScript" }],
  },
];

const meta: Meta<typeof ProjectSearch> = {
  title: "Components/ProjectSearch",
  component: ProjectSearch,
  tags: ["autodocs"],
  args: {
    repositories,
    searchTree: buildSearchTree(repositories, repositoryText),
  },
  parameters: {
    docs: {
      description: {
        component:
          "Type `repo`, `gallery` or `javascript`. Results are links to the sections already on the page, so nothing in the project list moves.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProjectSearch>;

export const Default: Story = {};

export const NoMatches: Story = {
  args: { repositories: [], searchTree: {} },
};
