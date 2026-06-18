import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroCta {
  href: string;
  label: string;
}

interface HeroProps {
  description: string;
  eyebrow?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  title: string;
}

export function Hero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
}: HeroProps) {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32 lg:py-40">
        {eyebrow && (
          <p className="mb-4 font-semibold text-brand text-sm uppercase tracking-widest">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl font-semibold text-4xl text-foreground tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          {description}
        </p>
        {(primaryCta ?? secondaryCta) && (
          <div className="mt-10 flex flex-wrap gap-4">
            {primaryCta && (
              <Button asChild size="lg">
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
            )}
            {secondaryCta && (
              <Button asChild size="lg" variant="outline">
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
