import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { GlobalStyles } from "./globalStyles.ts";
import { StateProvider } from "./state/stateProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StateProvider>
      <GlobalStyles />
      <App />
    </StateProvider>
  </StrictMode>,
);
