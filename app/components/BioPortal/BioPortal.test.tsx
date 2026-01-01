import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BioPortal } from "./BioPortal";
import { mockBio } from "../../mocks/bio";
import { mockRepos } from "../../mocks/repos";
import userEvent from "@testing-library/user-event";

describe("BioPortal", () => {
  it("shows the bio and the list of technologies", async () => {
    render(
      <BioPortal
        bio={mockBio}
        repositories={mockRepos}
        showBio={true}
        onClose={vi.fn()}
      />,
    );
    expect(await screen.findByText(mockBio)).toBeInTheDocument();
    expect(await screen.findByText(/TypeScript/)).toBeInTheDocument();
    expect(await screen.findByText(/CSS/)).toBeInTheDocument();
  });

  it("calls onClose when clicking the button", async () => {
    const onClose = vi.fn();
    render(
      <BioPortal
        bio={mockBio}
        repositories={mockRepos}
        showBio={true}
        onClose={onClose}
      />,
    );
    const btn = await screen.findByLabelText("Close");
    await userEvent.click(btn);
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when pressing Escape", async () => {
    const onClose = vi.fn();
    render(
      <BioPortal
        bio={mockBio}
        repositories={mockRepos}
        showBio={true}
        onClose={onClose}
      />,
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });
});
