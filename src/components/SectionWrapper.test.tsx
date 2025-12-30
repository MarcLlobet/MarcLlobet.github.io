import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionWrapper } from "./SectionWrapper";
import { mockRepos } from "../mocks/repos";

const [firstMockRepo] = mockRepos.data;

describe("SectionWrapper", () => {
  it("returns section", async () => {
    render(<SectionWrapper repository={firstMockRepo} />);
    expect(await screen.findByLabelText("repo-1")).toBeInTheDocument();
    expect(screen.getByText("Repo de prova")).toBeInTheDocument();
    const img = screen.getByAltText(
      "Preview of repo-1 repository",
    ) as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("https://preview-1.png/");
    expect(screen.getByText("Demo")).toBeInTheDocument();
    expect(screen.getByText("Code")).toBeInTheDocument();

    const section = document.getElementById("repo-1");
    expect(section).toBeTruthy();
    expect(section?.textContent).toContain("1");
  });
});
