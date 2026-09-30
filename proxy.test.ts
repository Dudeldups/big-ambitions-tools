import { NextRequest } from "next/server";

let route: typeof import("./proxy").default;
const origin = "http://127.0.0.1:3000";
const englishHeaders = { "accept-language": "en", cookie: "NEXT_LOCALE=en" };

beforeAll(async () => {
  vi.stubEnv("NODE_ENV", "development");
  vi.resetModules();
  const { default: config } = await import("./next.config");
  // Next.js maps this public config flag to the request-normalization switch.
  vi.stubEnv(
    "__NEXT_NO_MIDDLEWARE_URL_NORMALIZE",
    config.skipProxyUrlNormalize ? "1" : "",
  );
  route = (await import("./proxy")).default;
});
afterAll(() => vi.unstubAllEnvs());

describe("development locale routing on the loopback address", () => {
  it.each(["/tools", "/tools/playthrough/factories"])(
    "keeps the English rewrite for %s on the same origin",
    (pathname) => {
      const response = route(
        new NextRequest(origin + pathname, { headers: englishHeaders }),
      );
      expect(response.headers.get("location")).toBeNull();
      const rewrite = new URL(response.headers.get("x-middleware-rewrite")!);
      expect(rewrite.origin).toBe(origin);
      expect(rewrite.pathname).toBe("/en" + pathname);
    },
  );

  it("removes the English prefix once without entering a redirect loop", () => {
    const response = route(
      new NextRequest(origin + "/en/tools?view=all", {
        headers: englishHeaders,
      }),
    );
    const target = new URL(response.headers.get("location")!);
    expect(target.origin).toBe(origin);
    expect(target.pathname + target.search).toBe("/tools?view=all");
    const next = route(new NextRequest(target, { headers: englishHeaders }));
    expect(next.headers.get("location")).toBeNull();
    expect(next.headers.get("x-middleware-rewrite")).toBe(
      origin + "/en/tools?view=all",
    );
  });

  it("serves the German-prefixed route without an English rewrite", () => {
    const response = route(new NextRequest(origin + "/de/tools"));
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-rewrite")).toBeNull();
    expect(
      response.headers.get("x-middleware-request-x-next-intl-locale"),
    ).toBe("de");
  });
});
