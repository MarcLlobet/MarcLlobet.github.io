import "@testing-library/jest-dom";
import { server } from "./mocks/mswServer";
import { afterAll, beforeAll, afterEach } from "vitest";

/**
 * @import "html-validate/vitest";
 * @link https://gitlab.com/html-validate/html-validate/-/blob/master/tests/vitest/component.spec.ts
 */
import "html-validate/vitest";

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());
afterAll(() => server.close());
