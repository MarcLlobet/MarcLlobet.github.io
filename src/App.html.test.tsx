import { expect, it } from "vitest";
import { App } from "./App";
import { render } from "@testing-library/react";
import { StateProvider } from "./state/stateProvider";

it.todo("has valid HTML", async () => {
  const { container } = render(
    <StateProvider>
      <App />
    </StateProvider>,
  );

  expect(container.innerHTML).toHTMLValidate();
});
