import { isHttpError, isHttpStatusError, newHttpError } from "./error";

import { describe, expect, it } from "vitest";

describe("HttpError", () => {
  describe("newHttpError", () => {
    it("returns new error from response", async () => {
      const response = new Response("badaboom", { status: 404 });
      const err = await newHttpError(response);

      expect(err.status).toBe(404);
      expect(err.message).toBe("request failed with status 404: badaboom");
    });

    it("catches decoding error", async () => {
      class mockedResponse {
        readonly status = 404;
        async text(): Promise<string> {
          throw new Error("bad");
        }
      }

      const response = new mockedResponse() as Response;
      const err = await newHttpError(response);

      expect(err.status).toBe(404);
      expect(err.message).toBe(
        "request failed with status 404: failed to decode response: bad"
      );
    });
  });

  describe("isHttpError", () => {
    it("catches HttpError", async () => {
      const response = new Response("badaboom", { status: 404 });
      const err = await newHttpError(response);

      expect(isHttpError(err)).toBeTruthy();
    });

    it("doesn't catch other errors", () => {
      const err = new TypeError("not an HttpError");
      expect(isHttpError(err)).toBeFalsy();
    });
  });

  describe("isHttpStatusError", () => {
    it("catches HttpError with correct status", async () => {
      const response = new Response("badaboom", { status: 404 });
      const err = await newHttpError(response);

      expect(isHttpStatusError(err, 401, 404)).toBeTruthy();
    });

    it("doesn't catch HttpError with incorrect status", async () => {
      const response = new Response("badaboom", { status: 500 });
      const err = await newHttpError(response);

      expect(isHttpStatusError(err, 401, 404)).toBeFalsy();
    });

    it("doesn't catch other errors", () => {
      const err = new TypeError("not an HttpError");
      expect(isHttpStatusError(err, 401, 404)).toBeFalsy();
    });
  });
});
