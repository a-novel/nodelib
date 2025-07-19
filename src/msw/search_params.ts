import { HttpResponse } from "msw";

export const matchSearchParams = async (
  request: Request,
  expect: URLSearchParams | ((req: URLSearchParams) => Promise<boolean | HttpResponse<any>>)
): Promise<boolean | HttpResponse<any>> => {
  const url = new URL(request.url);

  if (typeof expect === "function") {
    return (expect as (req: URLSearchParams) => Promise<boolean | HttpResponse<any>>)(url.searchParams);
  }

  for (const [key, value] of Object.entries(expect)) {
    if (url.searchParams.get(key) !== value) {
      return false;
    }
  }

  return true;
};
