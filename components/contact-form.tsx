"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import { sendContactEmail } from "@/app/contact/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ContactFormData } from "@/lib/schemas/contact";

type FieldErrors = Partial<Record<keyof ContactFormData, string>>;

interface FormValues {
  email: string;
  message: string;
  name: string;
  phone: string;
  subject: string;
}

const EMPTY_VALUES: FormValues = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const result = await sendContactEmail({
          name: values.name,
          email: values.email,
          phone: values.phone || undefined,
          subject: values.subject,
          message: values.message,
        });

        if (result.success) {
          toast.success("Message sent! We'll get back to you soon.");
          setValues(EMPTY_VALUES);
          setFieldErrors({});
        } else {
          setFieldErrors(result.fieldErrors ?? {});
          if (result.error) {
            toast.error(result.error);
          }
        }
      } catch {
        toast.error("Failed to send your message. Please try again later.");
      }
    });
  };

  return (
    <form className="flex flex-col gap-6" noValidate onSubmit={handleSubmit}>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            aria-invalid={!!fieldErrors.name}
            id="name"
            name="name"
            onChange={handleChange}
            placeholder="Jane Smith"
            type="text"
            value={values.name}
          />
          {fieldErrors.name && (
            <p
              className="text-destructive text-sm"
              id="name-error"
              role="alert"
            >
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            aria-invalid={!!fieldErrors.email}
            id="email"
            name="email"
            onChange={handleChange}
            placeholder="jane@example.com"
            type="email"
            value={values.email}
          />
          {fieldErrors.email && (
            <p
              className="text-destructive text-sm"
              id="email-error"
              role="alert"
            >
              {fieldErrors.email}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">
          Phone{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="phone"
          name="phone"
          onChange={handleChange}
          placeholder="+1 (555) 000-0000"
          type="tel"
          value={values.phone}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="subject">Subject</Label>
        <Input
          aria-describedby={fieldErrors.subject ? "subject-error" : undefined}
          aria-invalid={!!fieldErrors.subject}
          id="subject"
          name="subject"
          onChange={handleChange}
          placeholder="Project inquiry"
          type="text"
          value={values.subject}
        />
        {fieldErrors.subject && (
          <p
            className="text-destructive text-sm"
            id="subject-error"
            role="alert"
          >
            {fieldErrors.subject}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
          aria-invalid={!!fieldErrors.message}
          className="min-h-32 resize-y"
          id="message"
          name="message"
          onChange={handleChange}
          placeholder="Tell us about your project…"
          rows={6}
          value={values.message}
        />
        {fieldErrors.message && (
          <p
            className="text-destructive text-sm"
            id="message-error"
            role="alert"
          >
            {fieldErrors.message}
          </p>
        )}
      </div>

      <div>
        <Button
          className="sm:w-auto"
          disabled={isPending}
          size="lg"
          type="submit"
        >
          {isPending ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
