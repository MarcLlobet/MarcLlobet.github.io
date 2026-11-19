import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectSearch } from "./ProjectSearch";
import { mockRepos } from "../../mocks/repos";
import { mockSearchTree } from "../../mocks/searchTree";

const renderSearch = () =>
  render(
    <ProjectSearch repositories={mockRepos} searchTree={mockSearchTree} />,
  );

const getInput = () =>
  screen.getByRole("searchbox", { name: "Search projects" });

describe("ProjectSearch", () => {
  it("renders a labelled search box", () => {
    renderSearch();
    expect(getInput()).toBeInTheDocument();
  });

  it("shows no results until something is typed", () => {
    renderSearch();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("offers a matching project as a link to its section", async () => {
    renderSearch();
    await userEvent.type(getInput(), "typescript");

    const link = await screen.findByRole("link", { name: "repo 1" });
    expect(link).toHaveAttribute("href", "#repo-1");
    expect(
      screen.queryByRole("link", { name: "repo 2" }),
    ).not.toBeInTheDocument();
  });

  it("narrows the results as words are added", async () => {
    renderSearch();
    await userEvent.type(getInput(), "repo");

    expect(
      await screen.findByRole("link", { name: "repo 1" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: "repo 2" }),
    ).toBeInTheDocument();

    await userEvent.type(getInput(), " 2");

    // The lookup is debounced, so "repo 1" has to be waited out rather than
    // asserted away: "repo 2" is already on screen from the previous query.
    await waitFor(() => {
      expect(
        screen.queryByRole("link", { name: "repo 1" }),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByRole("link", { name: "repo 2" })).toBeInTheDocument();
  });

  it("says so when nothing matches", async () => {
    renderSearch();
    await userEvent.type(getInput(), "zzz");

    expect(await screen.findByText("No projects match")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("announces how many projects were found", async () => {
    renderSearch();
    await userEvent.type(getInput(), "typescript");

    expect(await screen.findByText("1 project found")).toBeInTheDocument();
  });

  it("clears the query and the results on Escape", async () => {
    renderSearch();
    await userEvent.type(getInput(), "typescript");
    await screen.findByRole("link", { name: "repo 1" });

    await userEvent.keyboard("{Escape}");

    expect(getInput()).toHaveValue("");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("clears the query once a result is chosen", async () => {
    renderSearch();
    await userEvent.type(getInput(), "typescript");

    await userEvent.click(await screen.findByRole("link", { name: "repo 1" }));

    expect(getInput()).toHaveValue("");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
