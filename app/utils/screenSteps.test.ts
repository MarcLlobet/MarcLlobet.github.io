import { describe, expect, it } from "vitest";
import {
  hasModifier,
  isInteractiveTarget,
  isTypingTarget,
  nearestStop,
  stepTarget,
  stopAt,
} from "./screenSteps";

/* Hero at 0, three projects one screen apart, a tall section, the footer. */
const STOPS = [0, 1000, 1800, 2600, 3400, 5800];
const SCREEN = 800;

describe("stepTarget", () => {
  it("goes to the next and the previous screen", () => {
    expect(stepTarget(STOPS, 1000, 1, SCREEN)).toBe(1800);
    expect(stepTarget(STOPS, 1800, -1, SCREEN)).toBe(1000);
  });

  it("treats a few pixels off a stop as being on it", () => {
    expect(stepTarget(STOPS, 1004, 1, SCREEN)).toBe(1800);
    expect(stepTarget(STOPS, 1796, -1, SCREEN)).toBe(1000);
  });

  it("lands on the next screen from anywhere between two", () => {
    expect(stepTarget(STOPS, 1400, 1, SCREEN)).toBe(1800);
    expect(stepTarget(STOPS, 1400, -1, SCREEN)).toBe(1000);
  });

  it("doesn't add a stop for a screen only a little taller than the viewport", () => {
    expect(stepTarget(STOPS, 0, 1, SCREEN)).toBe(1000);
    expect(stepTarget(STOPS, 1000, -1, SCREEN)).toBe(0);
    expect(stepTarget(STOPS, 4600, 1, SCREEN)).toBe(5800);
  });

  it("reads a much taller section one screen at a time", () => {
    expect(stepTarget(STOPS, 3400, 1, SCREEN)).toBe(4200);
    expect(stepTarget(STOPS, 5800, -1, SCREEN)).toBe(5000);
    expect(stepTarget(STOPS, 5000, -1, SCREEN)).toBe(4200);
  });

  it("stays put past either end", () => {
    expect(stepTarget(STOPS, 0, -1, SCREEN)).toBe(0);
    expect(stepTarget(STOPS, 5800, 1, SCREEN)).toBe(5800);
  });
});

describe("stopAt / nearestStop", () => {
  it("finds the stop under the scroll position", () => {
    expect(stopAt(STOPS, 1802)).toBe(2);
    expect(stopAt(STOPS, 1400)).toBe(-1);
  });

  it("finds the closest stop", () => {
    expect(nearestStop(STOPS, 1350)).toBe(1);
    expect(nearestStop(STOPS, 1450)).toBe(2);
  });
});

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
