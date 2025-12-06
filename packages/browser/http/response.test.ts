import { newHttpError } from "./error";
import { decodeHttpResponse, handleHttpResponse } from "./response";

import { describe, expect, it } from "vitest";

import { z } from "zod";

describe("handleHttpResponse", () => {
  it("returns response on success", async () => {
    const response = new Response("badaboom", { status: 200 });

    const res = await handleHttpResponse(response);

    expect(res).toBe(response);
  });

  it("throws response on error", async () => {
    const response = new Response("badaboom", { status: 404 });
    const expectErr = await newHttpError(response.clone());

    await expect(handleHttpResponse(response)).rejects.toThrowError(expectErr);
  });
});

describe("decodeHttpResponse", () => {
  it("decodes and validate the response", async () => {
    const schema = z.object({
      foo: z.string(),
    });

    const response = new Response(`{"foo":"bar"}`, { status: 200 });

    const result = await decodeHttpResponse(schema)(response);

    expect(result).toStrictEqual({ foo: "bar" });
  });
});
