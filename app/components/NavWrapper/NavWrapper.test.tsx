import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NavWrapper } from "./NavWrapper";
import { mockBio } from "../../mocks/bio";
import { mockRepos } from "../../mocks/repos";
import userEvent from "@testing-library/user-event";

describe("NavWrapper", () => {
  it("renders Theme and About buttons", () => {
    render(<NavWrapper bio={mockBio} repositories={mockRepos} />);
    expect(screen.getByText("Theme")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it("toggles theme on click", () => {
    render(<NavWrapper bio={mockBio} repositories={mockRepos} />);
    const btn = screen.getByText("Theme");
    fireEvent.click(btn);
    expect(document.documentElement.classList.contains("light-theme")).toBe(
      true,
    );
  });

  it("lazy loads bio component on hover and shows bio on click", async () => {
    render(<NavWrapper bio={mockBio} repositories={mockRepos} />);
    const navWrapper = screen.getByRole("navigation");

    const beforeBioContent = screen.queryByText(mockBio);
    expect(beforeBioContent).not.toBeInTheDocument();

    await userEvent.hover(navWrapper);

    const aboutBtn = screen.getByText("About");
    await userEvent.click(aboutBtn);

    const bioContent = await screen.findByText(mockBio);
    expect(bioContent).toBeInTheDocument();
  });
});
