import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
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

  it("opens the demo in place on a plain click", () => {
    const onOpen = vi.fn();
    render(
      <ProjectCase
        repository={repository}
        index={0}
        total={1}
        accent="#FF7A45"
        kind="store"
        onOpen={onOpen}
      />,
    );
    fireEvent.click(
      screen.getByRole("link", { name: "Open the mobile store demo" }),
    );
    expect(onOpen).toHaveBeenCalledWith(
      repository,
      expect.any(HTMLAnchorElement),
    );
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
