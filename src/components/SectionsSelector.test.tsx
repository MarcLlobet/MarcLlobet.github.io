import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionsSelector } from "./SectionsSelector";
import { StateProvider } from "../state/stateProvider";

describe("SectionsSelector", () => {
  it("renders a SectionSelector for each repository", async () => {
    render(
      <StateProvider>
        <SectionsSelector />
      </StateProvider>,
    );

    expect(await screen.findByLabelText("repo-1")).toBeInTheDocument();
  });
});
