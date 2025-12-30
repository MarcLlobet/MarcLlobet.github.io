import { describe, it, expect } from "vitest";
import { getSentenceList } from "./getSentenceList";
import { render } from "@testing-library/react";

describe("getSentenceList", () => {
  it("renders a single item", () => {
    const { container } = render(<>{getSentenceList(["JS"])}</>);
    expect(container.textContent).toBe("JS");
  });

  it("renders two items with and", () => {
    const { container } = render(<>{getSentenceList(["JS", "TS"])}</>);
    expect(container.textContent).toBe("JS and TS");
  });

  it("renders three items with commas and and", () => {
    const { container } = render(
      <>{getSentenceList(["JS", "TS", "Python"])}</>,
    );
    expect(container.textContent).toBe("JS, TS and Python");
  });

  it("renders many items correctly", () => {
    const { container } = render(<>{getSentenceList(["A", "B", "C", "D"])}</>);
    expect(container.textContent).toBe("A, B, C and D");
  });
});
