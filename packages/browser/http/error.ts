/**
 * Wrap a failed HTTP response in an Error object, while keeping its content.
 */
export class HttpError extends Error {
  private readonly _status: number;

  constructor(status: number, text: string) {
    super(`request failed with status ${status}: ${text}`);

    this.name = "HttpError";
    this._status = status;
  }

  get status() {
    return this._status;
  }
}

export async function newHttpError(response: Response): Promise<HttpError> {
  const text = await response
    .text()
    .catch((err) => `failed to decode response: ${err.message}`);
  return new HttpError(response.status, text);
}

export function isHttpError(error: unknown): error is HttpError {
  return error instanceof Error && error.name === "HttpError";
}

/**
 * Check if the given error is an HttpError with one of the given status codes.
 */
export function isHttpStatusError(
  error: unknown,
  ...status: number[]
): boolean {
  return isHttpError(error) && status.includes(error.status);
}
