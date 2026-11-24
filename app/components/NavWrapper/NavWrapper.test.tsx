import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NavWrapper } from "./NavWrapper";

describe("NavWrapper", () => {
  afterEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("light-theme");
  });

  it("renders the Theme toggle", () => {
    render(<NavWrapper />);
    expect(screen.getByText("Theme")).toBeInTheDocument();
  });

  it("links to the sections of the home page", () => {
    render(<NavWrapper />);
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "href",
      "/#projects",
    );
  });

  it("links to the design page", () => {
    render(<NavWrapper />);
    expect(screen.getByRole("link", { name: "Design ↗" })).toHaveAttribute(
      "href",
      "/design",
    );
  });

  it("toggles theme on click, announces it, and remembers the choice", async () => {
    render(<NavWrapper />);
    const btn = screen.getByText("Theme");
    expect(btn).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(btn);

    expect(document.documentElement.classList.contains("light-theme")).toBe(
      true,
    );
    expect(window.localStorage.getItem("theme")).toBe("light");
    // The MutationObserver behind aria-pressed notifies asynchronously.
    await waitFor(() => expect(btn).toHaveAttribute("aria-pressed", "true"));
  });

  it("records the click's position for the next page's reveal", () => {
    render(<NavWrapper />);
    fireEvent.click(screen.getByRole("link", { name: "Design ↗" }));
    const style = document.documentElement.style;
    expect(style.getPropertyValue("--vt-x")).not.toBe("");
    expect(style.getPropertyValue("--vt-y")).not.toBe("");
  });
});
