import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SectionSelector } from "./SectionSelector";

const mockRepository = { id: "1", name: "repo-1" };

describe("SectionSelector", () => {
  it("renders with correct accessible name and href", () => {
    render(
      <SectionSelector repository={mockRepository} currentSection={null} />,
    );
    const link = screen.getByRole("menuitemradio", {
      name: "Go to repo-1 section",
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#repo-1");
    expect(link).toHaveAttribute("aria-checked", "false");
  });

  it("shows selected state when currentSection matches", () => {
    render(
      <SectionSelector repository={mockRepository} currentSection={"repo-1"} />,
    );
    const link = screen.getByRole("menuitemradio", {
      name: "Go to repo-1 section",
    });
    expect(link).toHaveAttribute("aria-checked", "true");
  });

  it("is a native anchor, so navigation works without JavaScript", () => {
    render(
      <SectionSelector repository={mockRepository} currentSection={null} />,
    );
    const link = screen.getByRole("menuitemradio", {
      name: "Go to repo-1 section",
    });
    expect(fireEvent.click(link)).toBe(true);
    expect(link).toHaveAttribute("href", "#repo-1");
  });
});
