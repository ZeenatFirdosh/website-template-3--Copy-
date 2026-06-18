import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CTACta {
  href: string;
  label: string;
}

interface CTAProps {
  description?: string;
  primaryCta: CTACta;
  secondaryCta?: CTACta;
  title: string;
}

export function CTA({
  title,
  description,
  primaryCta,
  secondaryCta,
}: CTAProps) {
  return (
    <section className="bg-primary py-20 text-primary-foreground">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-semibold text-3xl tracking-tight sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-lg text-primary-foreground/70">
              {description}
            </p>
          )}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
            {secondaryCta && (
              <Button
                asChild
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                size="lg"
                variant="outline"
              >
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
