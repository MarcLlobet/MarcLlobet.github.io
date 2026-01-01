import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionsSelector } from "./SectionsSelector";
import { mockRepos } from "../../mocks/repos";

describe("SectionsSelector", () => {
  it("renders a SectionSelector for each repository", async () => {
    render(<SectionsSelector repositories={mockRepos} />);

    expect(
      await screen.findByRole("menuitemradio", {
        name: "Go to repo-1 section",
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("menuitemradio", {
        name: "Go to repo-2 section",
      }),
    ).toBeInTheDocument();
  });
});
