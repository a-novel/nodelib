import { HttpResponse } from "msw";

export const matchHeaders = async (
  request: Request,
  expect: Headers | ((req: Headers) => Promise<boolean | HttpResponse<any>>)
): Promise<boolean | HttpResponse<any>> => {
  if (typeof expect === "function") {
    return (expect as (req: Headers) => Promise<boolean | HttpResponse<any>>)(request.headers);
  }

  for (const [key, value] of Object.entries(expect)) {
    if (request.headers.get(key) !== value) {
      return false;
    }
  }
  return true;
};
