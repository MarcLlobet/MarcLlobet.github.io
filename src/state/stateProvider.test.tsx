import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StateProvider } from "./stateProvider";
import { useStateContext } from "./index";
import type { Pen } from "../../scripts/get-codepen-pens";
import type { Repository } from "../services";

const Consumer = () => {
  const { repositories, pens } = useStateContext();
  const repo: Repository | undefined = repositories[0];
  const pen: Pen | undefined = pens[0];
  return (
    <>
      <b data-testid="repo-name">{repo?.name}</b>
      <b data-testid="pen-name">{pen?.name}</b>
    </>
  );
};

describe("StateProvider", () => {
  it("returns github repository", async () => {
    render(
      <StateProvider>
        <Consumer />
      </StateProvider>,
    );

    expect(await screen.findByTestId("repo-name")).toHaveTextContent("repo-1");
  });

  it("returns codepen pens", async () => {
    render(
      <StateProvider>
        <Consumer />
      </StateProvider>,
    );

    expect(await screen.findByTestId("pen-name")).toHaveTextContent(
      "Pen de prova",
    );
  });
});
