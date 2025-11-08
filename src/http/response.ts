import { HttpError } from "./error";

import type { ZodType } from "zod";

/**
 * Check the response status, and throw an HttpError if not ok (2xx).
 */
export function handleHttpResponse(response: Response): Response {
  if (!response.ok) {
    throw new HttpError(response);
  }
  return response;
}

/**
 * Decode the JSON body of an HTTP response, and validate it using the given Zod validator.
 */
export function decodeHttpResponse<T>(validator: ZodType<T>) {
  return async function (response: Response): Promise<T> {
    const data = await response.json();
    return validator.parseAsync(data);
  };
}
