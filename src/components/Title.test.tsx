import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Title } from "./Title";

describe("Title", () => {
  it("renders the title text", () => {
    render(<Title title="Test Title" />);

    expect(
      screen.queryByRole("heading", { name: "Test Title" }),
    ).toBeInTheDocument();
  });

  it("highlights certain letters", () => {
    render(<Title title="doge" />);

    const highlightedTitle = screen.getByRole("heading", { name: "doge" });

    expect(highlightedTitle.innerHTML).toEqual(
      'd<span style="color: var(--color-accent)">o</span>ge',
    );
  });

  it("replaces hyphens with spaces", () => {
    render(<Title title="abc-abc" />);

    expect(
      screen.getByRole("heading", { name: "abc abc" }),
    ).toBeInTheDocument();
  });
});
