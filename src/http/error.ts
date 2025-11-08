/**
 * Wrap a failed HTTP response in an Error object, while keeping its content.
 */
export class HttpError extends Error {
  private readonly _status: number;
  private readonly _text: Promise<string>;

  constructor(response: Response) {
    super(response.statusText);

    this.name = "HttpError";

    this._status = response.status;
    this._text = response.text();
  }

  get status() {
    return this._status;
  }

  get text() {
    return this._text;
  }
}

export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError;
}

/**
 * Check if the given error is an HttpError with one of the given status codes.
 */
export function isHttpStatusError(error: unknown, ...status: number[]): boolean {
  return isHttpError(error) && status.includes(error.status);
}
