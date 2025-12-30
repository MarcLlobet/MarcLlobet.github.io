import { describe, it, expect } from "vitest";
import { App } from "./App";
import { render } from "@testing-library/react";

describe("App", () => {
  it("renders without crashing", () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId("app-root")).toBeDefined();
  });
});
