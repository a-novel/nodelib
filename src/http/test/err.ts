import { isHttpStatusError } from "../error";

export async function expectStatus(callback: Promise<any>, status: number) {
  const res = await callback.catch((err) => err);

  if (!isHttpStatusError(res, status)) {
    throw new Error(`expected error with status ${status}, got: ${res.message ?? res}`);
  }
}
