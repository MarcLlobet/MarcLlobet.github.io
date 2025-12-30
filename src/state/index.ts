import { useContext } from "react";
import { stateContext, type State } from "./context";

export const useStateContext = () => {
  const context = useContext<State>(stateContext);
  if (context === undefined) {
    throw new Error("useStateContext must be used within a StateProvider");
  }
  return context;
};
