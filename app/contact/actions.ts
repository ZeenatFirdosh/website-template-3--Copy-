"use server";

import { render } from "@react-email/render";
import { captureException } from "@sentry/nextjs";
import React from "react";
import { Resend } from "resend";
import { z } from "zod";
import { ContactEmail, type ContactEmailProps } from "@/emails/contact";
import { type ContactFormData, contactFormSchema } from "@/lib/schemas/contact";
import { site } from "@/lib/site";

// Compile-time guard: ContactEmailProps data fields must stay in sync with ContactFormData.
// If this errors, update ContactEmailProps in emails/contact.tsx to match the schema.
type _SyncCheck =
  ContactFormData extends Omit<ContactEmailProps, "siteName" | "siteUrl">
    ? true
    : never;

type FieldErrors = Partial<Record<keyof ContactFormData, string>>;

export type ContactActionResult =
  | { success: true }
  | { success: false; fieldErrors?: FieldErrors; error?: string };

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(
  data: ContactFormData
): Promise<ContactActionResult> {
  const parsed = contactFormSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors: FieldErrors = {};
    const tree = z.treeifyError(parsed.error);
    for (const [field, node] of Object.entries(tree.properties ?? {})) {
      const first = (node as { errors: string[] }).errors?.[0];
      if (first) {
        fieldErrors[field as keyof ContactFormData] = first;
      }
    }
    return { success: false, fieldErrors };
  }

  let html: string;
  try {
    html = await render(
      React.createElement(ContactEmail, {
        ...parsed.data,
        siteName: site.name,
        siteUrl: site.url,
      })
    );
  } catch (err) {
    captureException(err, { extra: { context: "react-email render" } });
    return {
      success: false,
      error: "Failed to send your message. Please try again later.",
    };
  }

  const toEmail = process.env.CONTACT_TO_EMAIL ?? site.contact.email;

  // CONTACT_FROM_EMAIL must be a verified domain in Resend for production.
  // See https://resend.com/domains
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL ?? `noreply@${new URL(site.url).hostname}`;

  const { error } = await resend.emails.send({
    from: `${site.name} <${fromEmail}>`,
    to: toEmail,
    replyTo: parsed.data.email,
    subject: `[Contact] ${parsed.data.subject}`,
    html,
  });

  if (error) {
    captureException(new Error(error.message), {
      extra: {
        fromEmail,
        resendErrorName: error.name,
        senderEmail: parsed.data.email,
        senderName: parsed.data.name,
        subject: parsed.data.subject,
        toEmail,
      },
    });
    return {
      success: false,
      error: "Failed to send your message. Please try again later.",
    };
  }

  return { success: true };
}
