import { describe, expect, it } from "vitest";
import { hasModifier, isInteractiveTarget, isTypingTarget } from "./keyTargets";

describe("key targets", () => {
  it("leaves keys alone while typing", () => {
    const input = document.createElement("input");
    const editable = document.createElement("div");
    editable.setAttribute("contenteditable", "true");
    expect(isTypingTarget(input)).toBe(true);
    expect(isTypingTarget(editable)).toBe(true);
    expect(isTypingTarget(document.body)).toBe(false);
  });

  it("lets links and buttons handle their own Enter", () => {
    const link = document.createElement("a");
    link.href = "/";
    const span = document.createElement("span");
    link.append(span);
    expect(isInteractiveTarget(span)).toBe(true);
    expect(isInteractiveTarget(document.createElement("section"))).toBe(false);
  });

  it("ignores shortcuts with a modifier", () => {
    expect(
      hasModifier(new KeyboardEvent("keydown", { key: "ArrowDown" })),
    ).toBe(false);
    expect(
      hasModifier(
        new KeyboardEvent("keydown", { key: "ArrowDown", altKey: true }),
      ),
    ).toBe(true);
  });
});
