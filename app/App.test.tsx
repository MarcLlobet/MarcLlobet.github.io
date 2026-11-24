import { describe, it, expect } from "vitest";
import { App } from "./App";
import { render, screen } from "@testing-library/react";
import { mockRepos } from "./mocks/repos";
import { mockBio } from "./mocks/bio";

describe("App", () => {
  it("renders without crashing", () => {
    const { getByTestId } = render(
      <App repositories={mockRepos} bio={mockBio} site={null} />,
    );
    expect(getByTestId("app-root")).toBeDefined();
  });

  it("features the pinned projects and lists the rest in the archive", () => {
    render(
      <App
        repositories={mockRepos}
        bio={mockBio}
        pinned={["repo-2"]}
        site={null}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "repo 2" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Archive" }),
    ).toBeInTheDocument();
  });

  it("has valid HTML", () => {
    const { container } = render(
      <App repositories={mockRepos} bio={mockBio} site={null} />,
    );

    expect(container.innerHTML).toHTMLValidate();
  });
});
