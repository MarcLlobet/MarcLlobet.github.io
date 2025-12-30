import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { MorphShape } from "./MorphShape";
import React from "react";

describe("MorphShape", () => {
  it("calls onMorph callback", () => {
    const ref = React.createRef<{ morph: () => void; reset: () => void }>();
    const mockOnMorph = vi.fn();
    render(<MorphShape ref={ref} onMorph={mockOnMorph} />);
    ref.current?.morph();
    expect(mockOnMorph).toHaveBeenCalled();
  });
  it("calls onReset callback", () => {
    const ref = React.createRef<{ morph: () => void; reset: () => void }>();
    const mockOnReset = vi.fn();
    render(<MorphShape ref={ref} onReset={mockOnReset} />);
    ref.current?.reset();
    expect(mockOnReset).toHaveBeenCalled();
  });
});
