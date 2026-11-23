import { afterEach, describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BioPortal } from "./BioPortal";
import { mockBio } from "../../mocks/bio";
import { mockRepos } from "../../mocks/repos";

const GITHUB_URL = "https://github.com/MarcLlobet";

const stubPointer = (matches: boolean) =>
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }) as unknown as typeof matchMedia,
  );

describe("BioPortal", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

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
    expect(screen.getByText(mockBio)).toBeInTheDocument();
  });

  it("shows the Escape hint on a fine-pointer (keyboard-likely) device", () => {
    stubPointer(true);
    render(
      <BioPortal
        bio={mockBio}
        repositories={mockRepos}
        githubUrl={GITHUB_URL}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText("ESC")).toBeInTheDocument();
  });

  it("hides the Escape hint without a fine pointer (touch-only device)", () => {
    stubPointer(false);
    render(
      <BioPortal
        bio={mockBio}
        repositories={mockRepos}
        githubUrl={GITHUB_URL}
        onClose={vi.fn()}
      />,
    );
    expect(screen.queryByText("ESC")).not.toBeInTheDocument();
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
