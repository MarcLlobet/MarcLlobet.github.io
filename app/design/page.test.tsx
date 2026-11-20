import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DesignPage from "./page";
import { MOCKUP_KINDS } from "../mockups";

describe("DesignPage", () => {
  it("shows the system, section by section", () => {
    render(<DesignPage />);
    for (const name of [
      "Colour",
      "Type",
      "The line",
      "Mockups",
      "One project, one screen",
      "The impossible triangle",
    ]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeVisible();
    }
  });

  it("names every colour token and every mockup", () => {
    render(<DesignPage />);
    expect(screen.getByText("--color-bg")).toBeVisible();
    expect(screen.getByText("--accent-6")).toBeVisible();
    for (const kind of MOCKUP_KINDS) {
      expect(screen.getByText(kind)).toBeVisible();
    }
  });

  it("changes the shape of the box the mockups are drawn in", async () => {
    render(<DesignPage />);
    const frame = screen.getByRole("button", { name: "Desktop frame" });
    const phone = screen.getByRole("button", { name: "Phone" });
    expect(frame).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(phone);

    expect(phone).toHaveAttribute("aria-pressed", "true");
    expect(frame).toHaveAttribute("aria-pressed", "false");
  });

  it("has valid HTML", () => {
    const { container } = render(<DesignPage />);
    expect(container.innerHTML).toHTMLValidate();
  });
});
