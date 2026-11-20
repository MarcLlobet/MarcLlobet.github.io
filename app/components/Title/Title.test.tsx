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

  it("replaces hyphens with spaces", () => {
    render(<Title title="abc-abc" />);

    expect(
      screen.getByRole("heading", { name: "abc abc" }),
    ).toBeInTheDocument();
  });
});
