import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NavWrapper } from "./NavWrapper";

type FakeEntry = { target: Element; isIntersecting: boolean };

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    FakeIntersectionObserver.instances.push(this);
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  trigger(entries: FakeEntry[]) {
    this.callback(
      entries as IntersectionObserverEntry[],
      this as unknown as IntersectionObserver,
    );
  }
}

const makeSection = (id: string) => {
  const el = document.createElement("div");
  el.id = id;
  document.body.appendChild(el);
  return el;
};

describe("NavWrapper", () => {
  beforeEach(() => {
    FakeIntersectionObserver.instances = [];
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  });

  afterEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("light-theme");
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  it("renders the Theme toggle", () => {
    render(<NavWrapper />);
    expect(screen.getByText("Theme")).toBeInTheDocument();
  });

  it("links to the home page's sections, Archive excluded without one", () => {
    render(<NavWrapper />);
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "href",
      "/#projects",
    );
    expect(screen.getByRole("link", { name: "Meta" })).toHaveAttribute(
      "href",
      "/#meta",
    );
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/#site-footer",
    );
    expect(screen.queryByRole("link", { name: "Archive" })).toBeNull();
  });

  it("links to Archive when the home page has one", () => {
    render(<NavWrapper hasArchive />);
    expect(screen.getByRole("link", { name: "Archive" })).toHaveAttribute(
      "href",
      "/#archive",
    );
  });

  it("links to the design page", () => {
    render(<NavWrapper />);
    expect(screen.getByRole("link", { name: "Design ↗" })).toHaveAttribute(
      "href",
      "/design",
    );
  });

  it("highlights whichever section is scrolled into view", async () => {
    makeSection("projects");
    makeSection("site-footer");
    render(<NavWrapper />);
    const observer = FakeIntersectionObserver.instances[0];

    const projectsLink = screen.getByRole("link", { name: "Projects" });
    const contactLink = screen.getByRole("link", { name: "Contact" });
    expect(projectsLink).not.toHaveAttribute("aria-current");

    observer.trigger([
      { target: document.getElementById("projects")!, isIntersecting: true },
    ]);
    await waitFor(() =>
      expect(projectsLink).toHaveAttribute("aria-current", "true"),
    );
    expect(contactLink).not.toHaveAttribute("aria-current");
  });

  it("toggles theme on click, announces it, and remembers the choice", async () => {
    render(<NavWrapper />);
    const btn = screen.getByText("Theme");
    expect(btn).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(btn);

    expect(document.documentElement.classList.contains("light-theme")).toBe(
      true,
    );
    expect(window.localStorage.getItem("theme")).toBe("light");
    // The MutationObserver behind aria-pressed notifies asynchronously.
    await waitFor(() => expect(btn).toHaveAttribute("aria-pressed", "true"));
  });

  it("records the click's position for the next page's reveal", () => {
    render(<NavWrapper />);
    fireEvent.click(screen.getByRole("link", { name: "Design ↗" }));
    const style = document.documentElement.style;
    expect(style.getPropertyValue("--vt-x")).not.toBe("");
    expect(style.getPropertyValue("--vt-y")).not.toBe("");
  });
});
