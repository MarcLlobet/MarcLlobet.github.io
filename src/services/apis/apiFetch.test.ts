import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from "vitest";
import { apiFetch } from "./apiFetch";

const originalFetch = global.fetch;

describe("apiFetch", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("returns parsed JSON when response is ok", async () => {
    const mockData = { foo: "bar" };
    (globalThis.fetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: mockData }),
    });
    const result = await apiFetch("/api/test");
    expect(result).toEqual(mockData);
  });

  it("throws if response is not ok", async () => {
    (globalThis.fetch as Mock).mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({}),
    });
    await expect(apiFetch("/api/404")).rejects.toThrow(
      "API request '/api/404' failed with status 404",
    );
  });
});
