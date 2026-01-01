import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageWrapper } from "./PageWrapper";
import { mockRepos } from "../../mocks/repos";

describe("PageWrapper", () => {
  it("renders page with sections", async () => {
    render(<PageWrapper repositories={mockRepos} />);

    const section = await screen.findByRole("region", { name: "repo 1" });
    expect(section).toBeInTheDocument();
  });

  it("renders all repository sections", async () => {
    render(<PageWrapper repositories={mockRepos} />);

    expect(
      await screen.findByRole("region", { name: "repo 1" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("region", { name: "repo 2" }),
    ).toBeInTheDocument();
  });
});
