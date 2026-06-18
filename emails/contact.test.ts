import { render } from "@react-email/render";
import React from "react";
import { describe, expect, it } from "vitest";
import { ContactEmail } from "./contact";

const base = {
  name: "Jane Smith",
  email: "jane@example.com",
  subject: "Project inquiry",
  message: "Hello, I would like to work with you.",
  siteName: "Northbeam",
  siteUrl: "https://northbeam.com",
};

async function renderHtml(props: Partial<typeof base> & { phone?: string }) {
  return await render(React.createElement(ContactEmail, { ...base, ...props }));
}

describe("ContactEmail", () => {
  it("renders the sender name, email, subject and message", async () => {
    const html = await renderHtml({});
    expect(html).toContain(base.name);
    expect(html).toContain(base.email);
    expect(html).toContain(base.subject);
    expect(html).toContain(base.message);
  });

  const TEST_PHONE = "+1 555 000 0000";

  it("renders the Phone section when phone is provided", async () => {
    const html = await renderHtml({ phone: TEST_PHONE });
    expect(html).toContain(TEST_PHONE);
    expect(html).toContain("Phone");
  });

  it("omits the Phone section when phone is absent", async () => {
    const html = await renderHtml({});
    // Assert on the value, not the label — the label text "Phone" could appear
    // elsewhere in the template without breaking this contract.
    expect(html).not.toContain(TEST_PHONE);
  });

  it("renders the site name in the brand block", async () => {
    const html = await renderHtml({ siteName: "Acme Corp" });
    expect(html).toContain("Acme Corp");
  });

  it("renders a link to siteUrl in the footer", async () => {
    const html = await renderHtml({ siteUrl: "https://acme.com" });
    expect(html).toContain("https://acme.com");
  });

  it("defaults siteName to 'Website' and siteUrl to '#' when omitted", async () => {
    const html = await render(
      React.createElement(ContactEmail, {
        name: base.name,
        email: base.email,
        subject: base.subject,
        message: base.message,
      })
    );
    expect(html).toContain("Website");
    expect(html).toContain('href="#"');
  });

  it("applies white-space:pre-wrap styling to the message block", async () => {
    const html = await renderHtml({});
    expect(html).toContain("pre-wrap");
  });

  it("preserves multi-line message content", async () => {
    const multiLine = "Line one.\nLine two.\nLine three.";
    const html = await renderHtml({ message: multiLine });
    expect(html).toContain("Line one.");
    expect(html).toContain("Line two.");
    expect(html).toContain("Line three.");
  });
});
