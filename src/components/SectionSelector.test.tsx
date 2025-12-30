import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SectionSelector } from "./SectionSelector";

const mockRepository = { id: "1", name: "repo-1" };

describe("SectionSelector", () => {
  it("renders with correct aria-label and href", () => {
    render(
      <SectionSelector repository={mockRepository} currentSection={null} />,
    );
    const link = screen.getByLabelText("repo-1");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#repo-1");
    expect(link).toHaveAttribute("role", "menuitemradio");
    expect(link).toHaveAttribute("aria-checked", "false");
  });

  it("shows selected state when currentSection matches", () => {
    render(
      <SectionSelector repository={mockRepository} currentSection={"repo-1"} />,
    );
    const link = screen.getByLabelText("repo-1");
    expect(link).toHaveAttribute("aria-checked", "true");
  });

  it("scrolls to section on click", () => {
    window.scrollTo = vi.fn();

    const dummy = document.createElement("div");
    dummy.id = "repo-1";
    document.body.appendChild(dummy);
    render(
      <SectionSelector repository={mockRepository} currentSection={null} />,
    );
    const link = screen.getByLabelText("repo-1");
    fireEvent.click(link);
    expect(window.scrollTo).toHaveBeenCalled();
    document.body.removeChild(dummy);
  });
});
