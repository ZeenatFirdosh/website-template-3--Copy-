import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// ─── Hoisted mocks ────────────────────────────────────────────────────────────
// vi.mock() factories are hoisted to the top of the file at compile time.
// Variables those factories capture must also be hoisted via vi.hoisted(),
// otherwise they evaluate to `undefined` when the factory first runs.

const mockEmailsSend = vi.hoisted(() => vi.fn());
const mockCaptureException = vi.hoisted(() => vi.fn());
const mockRender = vi.hoisted(() =>
  vi.fn().mockResolvedValue("<html>email</html>")
);

vi.mock("resend", () => ({
  // `this: any` lets the constructor assign instance properties without a full class declaration.
  Resend: vi.fn().mockImplementation(function (this: any) {
    this.emails = { send: mockEmailsSend };
  }),
}));

vi.mock("@sentry/nextjs", () => ({
  captureException: mockCaptureException,
}));

vi.mock("@react-email/render", () => ({
  render: mockRender,
}));

import { sendContactEmail } from "./actions";

// ─── Constants ────────────────────────────────────────────────────────────────

const AT_SIGN_RE = /@/;
const NOREPLY_RE = /noreply@/;

const validPayload = {
  name: "Jane Smith",
  email: "jane@example.com",
  subject: "Project inquiry",
  message: "Hello, I would like to work with you.",
};

// Stable env values used in beforeEach — tests are isolated from .env contents.
const TEST_ENV = {
  CONTACT_TO_EMAIL: "to@test.example",
  CONTACT_FROM_EMAIL: "from@test.example",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resendSuccess() {
  // Persistent default (not Once) so mockResolvedValueOnce in tests can override it.
  mockEmailsSend.mockResolvedValue({ data: { id: "1" }, error: null });
}

// vi.stubEnv(key, '') does NOT trigger ?? fallbacks — an empty string is defined,
// so ?? short-circuits. Deleting the key forces `process.env[key]` to return
// `undefined`, which is what the action's fallback logic requires.
async function withEnvUnset<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const saved = process.env[key];
  delete process.env[key];
  try {
    return await fn();
  } finally {
    if (saved === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = saved;
    }
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("sendContactEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Stub env vars the action reads — isolates tests from whatever .env contains.
    vi.stubEnv("CONTACT_TO_EMAIL", TEST_ENV.CONTACT_TO_EMAIL);
    vi.stubEnv("CONTACT_FROM_EMAIL", TEST_ENV.CONTACT_FROM_EMAIL);
    resendSuccess();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // ── Validation ──────────────────────────────────────────────────────────────

  describe("validation", () => {
    it("returns fieldErrors and does not call send when required fields are missing", async () => {
      const result = await sendContactEmail({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors?.name).toBe("Name is required.");
        expect(result.fieldErrors?.subject).toBe("Subject is required.");
        expect(result.fieldErrors?.message).toBe("Message is required.");
      }
      expect(mockEmailsSend).not.toHaveBeenCalled();
    });

    it("returns a fieldError for an invalid email address", async () => {
      const result = await sendContactEmail({
        ...validPayload,
        email: "not-an-email",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors?.email).toBe(
          "A valid email address is required."
        );
      }
    });

    it("maps only the first Zod issue per field into fieldErrors", async () => {
      const result = await sendContactEmail({ ...validPayload, name: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(typeof result.fieldErrors?.name).toBe("string");
      }
    });
  });

  // ── Successful send ──────────────────────────────────────────────────────────

  describe("successful send", () => {
    it("returns { success: true } when Resend accepts the email", async () => {
      const result = await sendContactEmail(validPayload);
      expect(result.success).toBe(true);
    });

    it("calls resend.emails.send exactly once", async () => {
      await sendContactEmail(validPayload);
      expect(mockEmailsSend).toHaveBeenCalledTimes(1);
    });

    it("sets replyTo to the sender's email address", async () => {
      await sendContactEmail(validPayload);
      expect(mockEmailsSend).toHaveBeenCalledWith(
        expect.objectContaining({ replyTo: validPayload.email })
      );
    });

    it("prefixes the email subject with [Contact]", async () => {
      await sendContactEmail(validPayload);
      expect(mockEmailsSend).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: `[Contact] ${validPayload.subject}`,
        })
      );
    });
  });

  // ── Email addressing ─────────────────────────────────────────────────────────

  describe("email addressing", () => {
    it("sends to CONTACT_TO_EMAIL when the env var is set", async () => {
      vi.stubEnv("CONTACT_TO_EMAIL", "custom-to@example.com");
      await sendContactEmail(validPayload);
      expect(mockEmailsSend).toHaveBeenCalledWith(
        expect.objectContaining({ to: "custom-to@example.com" })
      );
    });

    it("falls back to site.contact.email when CONTACT_TO_EMAIL is unset", async () => {
      await withEnvUnset("CONTACT_TO_EMAIL", async () => {
        await sendContactEmail(validPayload);
        const call = mockEmailsSend.mock.calls[0]?.[0] as { to: string };
        // site.contact.email = "hello@northbeam.com" in lib/site.ts
        expect(call.to).toMatch(AT_SIGN_RE);
      });
    });

    it("uses CONTACT_FROM_EMAIL in the From header when set", async () => {
      vi.stubEnv("CONTACT_FROM_EMAIL", "custom-from@acme.com");
      await sendContactEmail(validPayload);
      expect(mockEmailsSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: expect.stringContaining("custom-from@acme.com"),
        })
      );
    });

    it("derives noreply@<hostname> from site.url when CONTACT_FROM_EMAIL is unset", async () => {
      await withEnvUnset("CONTACT_FROM_EMAIL", async () => {
        await sendContactEmail(validPayload);
        const call = mockEmailsSend.mock.calls[0]?.[0] as { from: string };
        expect(call.from).toMatch(NOREPLY_RE);
      });
    });
  });

  // ── Email render failure ─────────────────────────────────────────────────────

  describe("email render failure", () => {
    it("returns a generic error message when render throws", async () => {
      mockRender.mockRejectedValueOnce(new Error("render boom"));
      const result = await sendContactEmail(validPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          "Failed to send your message. Please try again later."
        );
      }
    });

    it("captures the render exception to Sentry with context", async () => {
      mockRender.mockRejectedValueOnce(new Error("render boom"));
      await sendContactEmail(validPayload);
      expect(mockCaptureException).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          extra: expect.objectContaining({ context: "react-email render" }),
        })
      );
    });

    it("does not call resend when render fails", async () => {
      mockRender.mockRejectedValueOnce(new Error("render boom"));
      await sendContactEmail(validPayload);
      expect(mockEmailsSend).not.toHaveBeenCalled();
    });
  });

  // ── Resend API failure ───────────────────────────────────────────────────────

  describe("Resend API failure", () => {
    it("returns a generic error message when Resend returns an error", async () => {
      mockEmailsSend.mockResolvedValueOnce({
        error: { name: "validation_error", message: "Invalid API key" },
      });
      const result = await sendContactEmail(validPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          "Failed to send your message. Please try again later."
        );
      }
    });

    it("captures the Resend error to Sentry with identifying context", async () => {
      mockEmailsSend.mockResolvedValueOnce({
        error: { name: "rate_limit_error", message: "Too many requests" },
      });
      await sendContactEmail(validPayload);
      expect(mockCaptureException).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          extra: expect.objectContaining({
            resendErrorName: "rate_limit_error",
            senderEmail: validPayload.email,
            senderName: validPayload.name,
            subject: validPayload.subject,
          }),
        })
      );
    });

    it("never leaks the raw Resend error message to the caller", async () => {
      const rawMessage = "Super secret internal API error details";
      mockEmailsSend.mockResolvedValueOnce({
        error: { name: "internal_error", message: rawMessage },
      });
      const result = await sendContactEmail(validPayload);
      if (!result.success) {
        expect(result.error).not.toContain(rawMessage);
      }
    });
  });
});
