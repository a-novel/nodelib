import { matchBodyBytes, matchBodyFormData, matchBodyJSON, matchBodyText } from "./body";
import { matchHeaders } from "./headers";
import { matchPathParams } from "./path_params";
import { ResolverFn } from "./resolver";
import { matchSearchParams } from "./search_params";

import { http as mswHTTP, HttpRequestHandler, HttpResponse, HttpResponseResolver, passthrough } from "msw";

class Resolver {
  private readonly handler: HttpRequestHandler;

  private readonly resolvers: ResolverFn[];

  constructor(handler: HttpRequestHandler) {
    this.handler = handler;
    this.resolvers = [];
  }

  resolver(fn: ResolverFn, errorResponse?: HttpResponse<any>): this {
    if (errorResponse) {
      this.resolvers.push(async (args) => {
        const res = await fn(args);
        return res ? res : errorResponse;
      });
      return this;
    }

    this.resolvers.push(fn);
    return this;
  }

  bodyJSON(expect: Parameters<typeof matchBodyJSON>[1], errorResponse?: HttpResponse<any>) {
    return this.resolver(async ({ request }) => matchBodyJSON(request, expect), errorResponse);
  }
  bodyText(expect: Parameters<typeof matchBodyText>[1], errorResponse?: HttpResponse<any>) {
    return this.resolver(async ({ request }) => matchBodyText(request, expect), errorResponse);
  }
  bodyFormData(expect: Parameters<typeof matchBodyFormData>[1], errorResponse?: HttpResponse<any>) {
    return this.resolver(async ({ request }) => matchBodyFormData(request, expect), errorResponse);
  }
  bodyBytes(expect: Parameters<typeof matchBodyBytes>[1], errorResponse?: HttpResponse<any>) {
    return this.resolver(async ({ request }) => matchBodyBytes(request, expect), errorResponse);
  }

  headers(expect: Parameters<typeof matchHeaders>[1], errorResponse?: HttpResponse<any>) {
    return this.resolver(async ({ request }) => matchHeaders(request, expect), errorResponse);
  }

  params(expect: Parameters<typeof matchPathParams>[1], errorResponse?: HttpResponse<any>) {
    return this.resolver(async ({ params }) => matchPathParams(params, expect), errorResponse);
  }

  searchParams(expect: Parameters<typeof matchSearchParams>[1], errorResponse?: HttpResponse<any>) {
    return this.resolver(async ({ request }) => matchSearchParams(request, expect), errorResponse);
  }

  resolve(path: string, resolver: HttpResponseResolver): ReturnType<typeof this.handler> {
    return this.handler(path, async (args) => {
      for (const fn of this.resolvers) {
        const res = await fn(args);

        if (res === false) {
          return passthrough();
        }

        if (res !== true) {
          return res;
        }
      }

      return resolver(args);
    });
  }
}

export const http = {
  all: new Resolver(mswHTTP.all),
  head: new Resolver(mswHTTP.head),
  get: new Resolver(mswHTTP.get),
  post: new Resolver(mswHTTP.post),
  put: new Resolver(mswHTTP.put),
  delete: new Resolver(mswHTTP.delete),
  patch: new Resolver(mswHTTP.patch),
  options: new Resolver(mswHTTP.options),
};
