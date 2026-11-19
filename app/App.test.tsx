import { describe, it, expect } from "vitest";
import { App } from "./App";
import { render } from "@testing-library/react";
import { mockRepos } from "./mocks/repos";
import { mockBio } from "./mocks/bio";
import { mockSearchTree } from "./mocks/searchTree";

describe("App", () => {
  it("renders without crashing", () => {
    const { getByTestId } = render(
      <App
        repositories={mockRepos}
        bio={mockBio}
        searchTree={mockSearchTree}
      />,
    );
    expect(getByTestId("app-root")).toBeDefined();
  });

  it("has valid HTML", () => {
    const { container } = render(
      <App
        repositories={mockRepos}
        bio={mockBio}
        searchTree={mockSearchTree}
      />,
    );

    expect(container.innerHTML).toHTMLValidate();
  });
});
