import { describe, expect, it } from "vitest";
import { contactFormSchema } from "./contact";

const valid = {
  name: "Jane Smith",
  email: "jane@example.com",
  subject: "Project inquiry",
  message: "Hello, I would like to work with you.",
  phone: "+1 555 000 0000",
};

describe("contactFormSchema", () => {
  it("accepts a fully valid payload with phone", () => {
    const result = contactFormSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toMatchObject(valid);
    }
  });

  it("accepts a valid payload without phone", () => {
    const { phone: _phone, ...withoutPhone } = valid;
    const result = contactFormSchema.safeParse(withoutPhone);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBeUndefined();
    }
  });

  it("transforms empty-string phone to undefined", () => {
    const result = contactFormSchema.safeParse({ ...valid, phone: "" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBeUndefined();
    }
  });

  it("preserves a non-empty phone value", () => {
    const result = contactFormSchema.safeParse({
      ...valid,
      phone: "+44 20 7946 0958",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBe("+44 20 7946 0958");
    }
  });

  it("rejects an invalid email address", () => {
    const result = contactFormSchema.safeParse({
      ...valid,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailIssue = result.error.issues.find((i) =>
        i.path.includes("email")
      );
      expect(emailIssue?.message).toBe("A valid email address is required.");
    }
  });

  it("rejects an empty name", () => {
    const result = contactFormSchema.safeParse({ ...valid, name: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes("name"));
      expect(issue?.message).toBe("Name is required.");
    }
  });

  it("rejects an empty subject", () => {
    const result = contactFormSchema.safeParse({ ...valid, subject: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes("subject"));
      expect(issue?.message).toBe("Subject is required.");
    }
  });

  it("rejects an empty message", () => {
    const result = contactFormSchema.safeParse({ ...valid, message: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes("message"));
      expect(issue?.message).toBe("Message is required.");
    }
  });

  it("collects errors for all required fields when the payload is empty", () => {
    const result = contactFormSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain("name");
      expect(paths).toContain("email");
      expect(paths).toContain("subject");
      expect(paths).toContain("message");
    }
  });
});
