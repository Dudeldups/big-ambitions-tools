import { afterEach, describe, expect, it, vi } from "vitest";

const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

describe("sendContactMessage", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    vi.resetModules();
    send.mockReset();
  });

  it("returns an error without constructing a mail request when configuration is missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("RESEND_EMAIL", "");
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { sendContactMessage } = await import("./actions");

    await expect(sendContactMessage(new FormData())).resolves.toEqual({
      success: false,
    });
    expect(send).not.toHaveBeenCalled();
  });
});
