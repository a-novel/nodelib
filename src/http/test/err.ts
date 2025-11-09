import { HttpError, isHttpStatusError } from "../error";

import { expect } from "vitest";

export async function expectStatus(callback: Promise<any>, status: number) {
  const res = await callback.catch((err) => err);

  expect(res).toBeInstanceOf(HttpError);
  expect(isHttpStatusError(res, status)).toBeTruthy();
}
