import { HttpResponse, HttpResponseResolver } from "msw";

export type ResolverFn = (...args: Parameters<HttpResponseResolver>) => Promise<boolean | HttpResponse<any>>;
