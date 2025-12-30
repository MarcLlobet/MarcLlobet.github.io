import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageWrapper } from "./PageWrapper";
import { StateProvider } from "../state/stateProvider";

describe("PageWrapper", () => {
  it("renders page", async () => {
    render(
      <StateProvider>
        <PageWrapper />
      </StateProvider>,
    );

    const section = await screen.findByLabelText("repo-1");
    expect(section).toBeInTheDocument();
  });
});
