import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PricingCta {
  href: string;
  label: string;
}

interface PricingPlan {
  cta: PricingCta;
  description: string;
  featured?: boolean;
  features: string[];
  name: string;
  period?: string;
  price: string;
}

interface PricingProps {
  description?: string;
  eyebrow?: string;
  plans: PricingPlan[];
  title: string;
}

export function Pricing({ eyebrow, title, description, plans }: PricingProps) {
  return (
    <section className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow && (
            <p className="mb-3 font-semibold text-brand text-sm uppercase tracking-widest">
              {eyebrow}
            </p>
          )}
          <h2 className="font-semibold text-3xl text-foreground tracking-tight sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          )}
        </div>

        <ul className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <li
              className={cn(
                "flex flex-col rounded-xl border p-8",
                plan.featured
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background"
              )}
              key={plan.name}
            >
              <div className="flex-1">
                <h3
                  className={cn(
                    "font-semibold",
                    plan.featured
                      ? "text-primary-foreground"
                      : "text-foreground"
                  )}
                >
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span
                    className={cn(
                      "font-bold text-4xl tracking-tight",
                      plan.featured
                        ? "text-primary-foreground"
                        : "text-foreground"
                    )}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      className={cn(
                        "text-sm",
                        plan.featured
                          ? "text-primary-foreground/60"
                          : "text-muted-foreground"
                      )}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>
                <p
                  className={cn(
                    "mt-4 text-sm",
                    plan.featured
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {plan.description}
                </p>
                <ul className="mt-8 flex flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li className="flex items-start gap-2" key={feature}>
                      <CheckIcon
                        aria-hidden="true"
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0",
                          plan.featured
                            ? "text-primary-foreground"
                            : "text-brand"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm",
                          plan.featured
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                        )}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                <Button
                  asChild
                  className="w-full"
                  size="lg"
                  variant={plan.featured ? "secondary" : "outline"}
                >
                  <Link href={plan.cta.href}>{plan.cta.label}</Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
