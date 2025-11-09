import { isEqual } from "lodash-es";
import { HttpResponse } from "msw";

export const matchBodyJSON = async <Body>(
  request: Request,
  expect: Body | ((req: Body) => boolean | HttpResponse<any>)
): Promise<boolean | HttpResponse<any>> => {
  const actualBody = await request.clone().json();

  if (typeof expect === "function") {
    return (expect as (req: Body) => boolean | HttpResponse<any>)(actualBody);
  }

  return isEqual(actualBody, expect as Body);
};

export const matchBodyText = async (
  request: Request,
  expect: string | ((req: string) => boolean | HttpResponse<any>)
): Promise<boolean | HttpResponse<any>> => {
  const actualBody = await request.clone().text();

  if (typeof expect === "function") {
    return (expect as (req: string) => boolean | HttpResponse<any>)(actualBody);
  }

  return actualBody === expect;
};

export const matchBodyFormData = async (
  request: Request,
  expect: FormData | ((req: FormData) => boolean | HttpResponse<any>)
): Promise<boolean | HttpResponse<any>> => {
  const actualBody = await request.clone().formData();

  if (typeof expect === "function") {
    return (expect as (req: FormData) => boolean | HttpResponse<any>)(actualBody);
  }

  for (const [key, value] of actualBody.entries()) {
    if (!expect.has(key) || expect.get(key) !== value) {
      return false;
    }
  }

  return true;
};

export const matchBodyBytes = async (
  request: Request,
  expect: Uint8Array<ArrayBuffer> | ((req: Uint8Array<ArrayBuffer>) => boolean | HttpResponse<any>)
): Promise<boolean | HttpResponse<any>> => {
  const actualBody = new Uint8Array(await request.clone().arrayBuffer());

  if (typeof expect === "function") {
    return (expect as (req: Uint8Array<ArrayBuffer>) => boolean | HttpResponse<any>)(actualBody);
  }

  return isEqual(actualBody, expect as Uint8Array<ArrayBuffer>);
};
