import { createContext } from "react";
import type { Repository, Pen } from "../services";

export type State = {
  repositories: Repository[];
  pens: Pen[];
};

export const stateContext = createContext<State>({
  repositories: [],
  pens: [],
});
