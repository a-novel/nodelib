export type RetryFailureFn<T, Params extends unknown[]> = (
  error: unknown,
  ...params: Params
) => T;

function defaultRetryFailureFn<T, Params extends unknown[]>(
  err: unknown,
  ..._: Params
): T {
  throw err;
}

export interface RetryParams<T, Params extends unknown[]> {
  /**
   * Total number of attempts (including the initial attempt) before failing.
   * @default 3
   */
  retries?: number;
  /**
   * Delay between retries in milliseconds.
   * @default 1000
   */
  delay?: number;
  /** Function to call on failure after all retries are exhausted.
   * By default, it throws the last error encountered.
   */
  onFailure?: RetryFailureFn<T, Params>;
  /**
   * If condition returns false, immediately stop retrying and call onFailure.
   */
  condition?: (err: unknown) => boolean;
}

/**
 * Retry a function call a number of times with a delay.
 */
export function retry<T, Params extends unknown[]>(
  callback: (...params: Params) => T | Promise<T>,
  {
    retries = 3,
    delay = 1000,
    onFailure = defaultRetryFailureFn<T, Params>, // Rethrow error by default.
    condition = () => true, // Always retry by default.
  }: RetryParams<T, Params> = {}
): (...params: Params) => Promise<T> {
  return async function doRetry(...params: Params): Promise<T> {
    let err: unknown;

    for (let i = 0; i < retries; i++) {
      try {
        return await callback(...params);
      } catch (error) {
        if (!condition(error)) {
          return onFailure(error, ...params);
        }

        err = error;
        // Don't delay after final attempt.
        if (i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    return onFailure(err, ...params);
  };
}
