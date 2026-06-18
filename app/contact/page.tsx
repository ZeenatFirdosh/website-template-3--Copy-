import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { PageHeader } from "@/components/sections/page-header";
import { createPageMetadata, site } from "@/lib/site";

export const metadata = createPageMetadata("contact", "/contact");

export default function Contact() {
  return (
    <main>
      <PageHeader
        description={site.pages.contact.description}
        eyebrow="Get in touch"
        title="Let's build something worth talking about."
      />

      <section className="bg-background py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-16 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <h2 className="font-semibold text-foreground text-xl">
                Send us a message
              </h2>
              <p className="mt-2 text-muted-foreground text-sm">
                Fill in the form and we&apos;ll get back to you within one
                business day.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>

            <aside className="lg:col-span-2">
              <h2 className="font-semibold text-foreground text-xl">
                Contact details
              </h2>
              <ul className="mt-6 flex flex-col gap-6">
                <li className="flex items-start gap-3">
                  <MailIcon
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-brand"
                  />
                  <div>
                    <p className="font-medium text-foreground text-sm">Email</p>
                    <a
                      className="mt-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
                      href={`mailto:${site.contact.email}`}
                    >
                      {site.contact.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <PhoneIcon
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-brand"
                  />
                  <div>
                    <p className="font-medium text-foreground text-sm">Phone</p>
                    <a
                      className="mt-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
                      href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                    >
                      {site.contact.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPinIcon
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-brand"
                  />
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      Office
                    </p>
                    <p className="mt-1 text-muted-foreground text-sm">
                      {site.contact.address}
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-10 rounded-xl border border-border bg-surface p-6">
                <p className="font-semibold text-foreground text-sm">
                  Typical response time
                </p>
                <p className="mt-1 text-muted-foreground text-sm">
                  We aim to reply to all enquiries within one business day.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
