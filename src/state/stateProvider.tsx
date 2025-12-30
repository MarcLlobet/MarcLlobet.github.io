import { useEffect, useRef, useState, type ReactNode } from "react";
import { fetchPens, fetchRepos } from "../services";
import { stateContext, type State } from "./context";

export const StateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const isFetched = useRef<boolean>(false);
  const [state, setState] = useState<State>({ repositories: [], pens: [] });

  useEffect(() => {
    if (isFetched.current) {
      return;
    }

    Promise.all([fetchRepos(), fetchPens()]).then(
      ([fetchedRepositories, fetchedPens]) => {
        isFetched.current = true;
        setState({
          repositories: fetchedRepositories,
          pens: fetchedPens,
        });
      },
    );
  }, []);

  return (
    <stateContext.Provider value={state as State}>
      {children}
    </stateContext.Provider>
  );
};
