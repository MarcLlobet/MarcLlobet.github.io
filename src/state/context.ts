import { createContext } from "react";
import type { Pen } from "../../scripts/get-codepen-pens";
import type { Repository } from "../services";

export type State = {
  repositories: Repository[];
  pens: Pen[];
};

export const stateContext = createContext<State>({
  repositories: [],
  pens: [],
});
