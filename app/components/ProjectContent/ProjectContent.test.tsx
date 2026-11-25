import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectContent } from "./ProjectContent";
import { mockRepos } from "../../mocks/repos";

// BackButton (rendered by ProjectContent) reads useRouter — not available
// without a real app-router mount, which this isolated render doesn't have.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}));

const repository = {
  ...mockRepos[0],
  name: "mobile-store",
  description:
    "A phone store built to feel effortless — instant search and a cart that survives reloads.",
  topics: ["demo", "mockup-store", "ecommerce"],
};

describe("ProjectContent", () => {
  it("shows the name, tagline, detail, tags and stats", () => {
    render(
      <ProjectContent repository={repository} accent="#FF7A45" kind="store" />,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "mobile store" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("A phone store built to feel effortless"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Instant search and a cart that survives reloads."),
    ).toBeInTheDocument();
    // Internal topics (demo, mockup-*) are filtered out; real ones remain.
    expect(screen.getByText("ecommerce")).toBeInTheDocument();
    expect(screen.queryByText("demo")).not.toBeInTheDocument();
    expect(screen.getByText("Jan 2024")).toBeInTheDocument();
    // No real star count to show yet.
    expect(screen.queryByText("Stars")).not.toBeInTheDocument();
  });

  it("falls back to the drawn mockup when the screenshot fails to load", () => {
    render(
      <ProjectContent repository={repository} accent="#FF7A45" kind="store" />,
    );
    const image = screen.getByRole("img", {
      name: "Screenshot of mobile store",
    });
    fireEvent.error(image);
    expect(
      screen.queryByRole("img", { name: "Screenshot of mobile store" }),
    ).not.toBeInTheDocument();
  });

  it("links to the live demo and the code", () => {
    render(
      <ProjectContent repository={repository} accent="#FF7A45" kind="store" />,
    );
    expect(screen.getByRole("link", { name: "Live demo ↗" })).toHaveAttribute(
      "href",
      repository.homepageUrl,
    );
    expect(screen.getByRole("link", { name: "Code ↗" })).toHaveAttribute(
      "href",
      repository.url,
    );
  });

  it("has valid HTML", () => {
    const { container } = render(
      <ProjectContent repository={repository} accent="#FF7A45" kind="store" />,
    );
    expect(container.innerHTML).toHTMLValidate();
  });
});
