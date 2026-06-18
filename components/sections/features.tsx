import type { ReactNode } from "react";

interface Feature {
  description: string;
  icon?: ReactNode;
  title: string;
}

interface FeaturesProps {
  columns?: 2 | 3 | 4;
  description?: string;
  eyebrow?: string;
  features: Feature[];
  title: string;
}

const columnClass = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

export function Features({
  eyebrow,
  title,
  description,
  features,
  columns = 3,
}: FeaturesProps) {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-2xl">
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

        <ul className={`mt-16 grid gap-10 ${columnClass[columns]}`}>
          {features.map((feature) => (
            <li className="flex flex-col gap-4" key={feature.title}>
              {feature.icon && (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface text-foreground">
                  {feature.icon}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
