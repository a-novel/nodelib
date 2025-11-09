import { isHttpStatusError } from "@a-novel/nodelib/browser/http";

export async function expectStatus(callback: Promise<any>, status: number) {
  const res = await callback.catch((err) => err);

  if (!isHttpStatusError(res, status)) {
    throw new Error(`expected error with status ${status}, got: ${res.message ?? res}`);
  }
}
