import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NavWrapper } from "./NavWrapper";
import userEvent from "@testing-library/user-event";
import { StateProvider } from "../state/stateProvider";
import { server } from "../mocks/mswServer";
import { http, HttpResponse } from "msw";
import { mockGetGithubUserData } from "../mocks/bio";

describe("NavWrapper", () => {
  it("renders Theme and About buttons", () => {
    render(<NavWrapper />);
    expect(screen.getByText("Theme")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it("toggles theme on click", () => {
    render(<NavWrapper />);
    const btn = screen.getByText("Theme");
    fireEvent.click(btn);
    expect(document.documentElement.classList.contains("light-theme")).toBe(
      true,
    );
  });

  it("lazy loads bio component on hover", async () => {
    render(
      <StateProvider>
        <NavWrapper />
      </StateProvider>,
    );
    const navWrapper = screen.getByRole("navigation");

    const beforeBioContent = screen.queryByText("Test bio");

    expect(beforeBioContent).not.toBeInTheDocument();

    userEvent.hover(navWrapper);

    const bioContent = await screen.findByText("Test bio");

    expect(bioContent).toBeInTheDocument();
  });

  it("fetch GetGithubUserData on nav hover", async () => {
    const fetchSpy = vi.fn();
    server.use(
      http.get("/data/github-bio.json", () => {
        fetchSpy();
        return HttpResponse.json(mockGetGithubUserData);
      }),
    );
    render(
      <StateProvider>
        <NavWrapper />
      </StateProvider>,
    );
    const navWrapper = screen.getByRole("navigation");

    userEvent.hover(navWrapper);

    await screen.findByText("Test bio");
    expect(fetchSpy).toHaveBeenCalled();
  });
});
