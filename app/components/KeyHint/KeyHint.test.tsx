import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Key, KeyHint } from "./KeyHint";

describe("KeyHint", () => {
  it("names each key for screen readers instead of reading its glyph", () => {
    render(
      <KeyHint>
        <Key glyph="⌫" label="Backspace" /> back
      </KeyHint>,
    );
    expect(screen.getByText("Backspace")).toBeInTheDocument();
    expect(screen.getByText("⌫")).toHaveAttribute("aria-hidden", "true");
  });

  it("has valid HTML", () => {
    const { container } = render(
      <KeyHint>
        <Key glyph="↵" label="Enter" /> open
      </KeyHint>,
    );
    expect(container.innerHTML).toHTMLValidate();
  });
});
