import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NavWrapper } from "./NavWrapper";
import { mockBio } from "../../mocks/bio";
import { mockRepos } from "../../mocks/repos";

const GITHUB_URL = "https://github.com/MarcLlobet";

describe("NavWrapper", () => {
  afterEach(() => {
    window.history.replaceState(null, "", "/");
    window.localStorage.clear();
    document.documentElement.classList.remove("light-theme");
  });

  it("renders Theme and About links", () => {
    render(
      <NavWrapper
        bio={mockBio}
        repositories={mockRepos}
        githubUrl={GITHUB_URL}
      />,
    );
    expect(screen.getByText("Theme")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about",
    );
  });

  it("links to the sections of the page", () => {
    render(
      <NavWrapper
        bio={mockBio}
        repositories={mockRepos}
        githubUrl={GITHUB_URL}
        hasArchive
      />,
    );
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute(
      "href",
      "#work",
    );
    expect(screen.getByRole("link", { name: "Archive" })).toHaveAttribute(
      "href",
      "#archive",
    );
  });

  it("hides the Archive link without an archive", () => {
    render(
      <NavWrapper
        bio={mockBio}
        repositories={mockRepos}
        githubUrl={GITHUB_URL}
      />,
    );
    expect(screen.queryByRole("link", { name: "Archive" })).toBeNull();
  });

  it("toggles theme on click, announces it, and remembers the choice", async () => {
    render(
      <NavWrapper
        bio={mockBio}
        repositories={mockRepos}
        githubUrl={GITHUB_URL}
      />,
    );
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

  it("opens About as an overlay and moves the address bar to /about", async () => {
    render(
      <NavWrapper
        bio={mockBio}
        repositories={mockRepos}
        githubUrl={GITHUB_URL}
      />,
    );

    const aboutLink = screen.getByRole("link", { name: "About" });
    await userEvent.click(aboutLink);

    expect(await screen.findByText(mockBio)).toBeInTheDocument();
    expect(window.location.pathname).toBe("/about");
  });

  it("closes back to / when the browser's Back is used", async () => {
    render(
      <NavWrapper
        bio={mockBio}
        repositories={mockRepos}
        githubUrl={GITHUB_URL}
      />,
    );

    await userEvent.click(screen.getByRole("link", { name: "About" }));
    expect(await screen.findByText(mockBio)).toBeInTheDocument();

    // Simulate the browser's own Back: the address moves and popstate fires.
    window.history.pushState(null, "", "/");
    fireEvent(window, new PopStateEvent("popstate"));

    await waitFor(() =>
      expect(screen.queryByText(mockBio)).not.toBeInTheDocument(),
    );
  });
});
