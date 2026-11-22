import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BioPortal } from "./BioPortal";
import { mockBio } from "../../mocks/bio";
import { mockRepos } from "../../mocks/repos";

const GITHUB_URL = "https://github.com/MarcLlobet";

describe("BioPortal", () => {
  it("shows the About chrome and the bio content", () => {
    render(
      <BioPortal
        bio={mockBio}
        repositories={mockRepos}
        githubUrl={GITHUB_URL}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("ESC")).toBeInTheDocument();
    expect(screen.getByText(mockBio)).toBeInTheDocument();
  });

  it("calls onClose after clicking Close, once the collapse finishes", async () => {
    const onClose = vi.fn();
    render(
      <BioPortal
        bio={mockBio}
        repositories={mockRepos}
        githubUrl={GITHUB_URL}
        onClose={onClose}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).not.toHaveBeenCalled();
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("calls onClose after pressing Escape, once the collapse finishes", async () => {
    const onClose = vi.fn();
    render(
      <BioPortal
        bio={mockBio}
        repositories={mockRepos}
        githubUrl={GITHUB_URL}
        onClose={onClose}
      />,
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).not.toHaveBeenCalled();
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });
});
