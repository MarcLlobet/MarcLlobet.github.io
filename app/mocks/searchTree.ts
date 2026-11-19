import { buildSearchTree } from "../lib/search";
import { repositoryText } from "../lib/search/repositories";
import { mockRepos } from "./repos";

export const mockSearchTree = buildSearchTree(mockRepos, repositoryText);
