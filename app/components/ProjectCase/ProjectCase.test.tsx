import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectCase } from "./ProjectCase";
import { mockRepos } from "../../mocks/repos";

const repository = {
  ...mockRepos[0],
  name: "mobile-store",
  description:
    "A phone store built to feel effortless — instant search and a cart that survives reloads.",
};

describe("ProjectCase", () => {
  it("shows the tagline and the detail separately", () => {
    render(
      <ProjectCase
        repository={repository}
        index={1}
        total={6}
        accent="#FF7A45"
        kind="store"
      />,
    );
    expect(
      screen.getByRole("heading", { name: "mobile store" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("A phone store built to feel effortless"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Instant search and a cart that survives reloads."),
    ).toBeInTheDocument();
    expect(screen.getByText("02 / 06")).toBeInTheDocument();
  });

  it("links the frame to the project's own page", () => {
    render(
      <ProjectCase
        repository={repository}
        index={0}
        total={1}
        accent="#FF7A45"
        kind="store"
      />,
    );
    expect(
      screen.getByRole("link", { name: "View mobile store" }),
    ).toHaveAttribute("href", "/projects/mobile-store");
  });

  it("has valid HTML", () => {
    const { container } = render(
      <ProjectCase
        repository={repository}
        index={0}
        total={1}
        accent="#FF7A45"
        kind="store"
      />,
    );
    expect(container.innerHTML).toHTMLValidate();
  });
});
