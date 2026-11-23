import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutContent } from "./AboutContent";
import { mockBio } from "../../mocks/bio";
import { mockRepos } from "../../mocks/repos";

const GITHUB_URL = "https://github.com/MarcLlobet";

describe("AboutContent", () => {
  it("shows the bio and a repo tile for each repository", () => {
    render(
      <AboutContent
        bio={mockBio}
        repositories={mockRepos}
        githubUrl={GITHUB_URL}
      />,
    );
    expect(screen.getByText(mockBio)).toBeInTheDocument();
    expect(screen.getByText(`(${mockRepos.length}) repos`)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "GitHub ↗" })).toHaveAttribute(
      "href",
      GITHUB_URL,
    );
  });

  it("skips the repo grid when there are no repositories", () => {
    render(
      <AboutContent bio={mockBio} repositories={[]} githubUrl={GITHUB_URL} />,
    );
    expect(screen.queryByText(/repos/)).not.toBeInTheDocument();
  });
});
