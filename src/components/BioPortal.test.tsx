import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import BioPortal from "./BioPortal";
import { StateProvider } from "../state/stateProvider";
import { mockBio } from "../mocks/bio";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";

describe("BioPortal", () => {
  it("shows the bio and the list of technologies", async () => {
    render(
      <StateProvider>
        <BioPortal bio={mockBio} showBio={true} onClose={vi.fn()} />
      </StateProvider>,
    );
    expect(await screen.findByText(mockBio)).toBeInTheDocument();
    expect(await screen.findByText("TypeScript")).toBeInTheDocument();
    expect(await screen.findByText("JavaScript")).toBeInTheDocument();
  });

  it("calls onClose when clicking the button", async () => {
    const onClose = vi.fn();
    render(<BioPortal bio={mockBio} showBio={true} onClose={onClose} />);
    const btn = await screen.findByLabelText("Close");
    await userEvent.click(btn);
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when pressing Escape", async () => {
    const onClose = vi.fn();
    render(<BioPortal bio={mockBio} showBio={true} onClose={onClose} />);
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });
});
