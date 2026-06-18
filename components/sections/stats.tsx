interface Stat {
  label: string;
  value: string;
}

interface StatsProps {
  eyebrow?: string;
  stats: Stat[];
  title?: string;
}

export function Stats({ eyebrow, title, stats }: StatsProps) {
  return (
    <section className="bg-primary py-20 text-primary-foreground">
      <div className="mx-auto max-w-5xl px-6">
        {(eyebrow ?? title) && (
          <div className="mb-16">
            {eyebrow && (
              <p className="mb-3 font-semibold text-primary-foreground/60 text-sm uppercase tracking-widest">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-semibold text-3xl tracking-tight">{title}</h2>
            )}
          </div>
        )}
        <dl className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="font-bold text-4xl tracking-tight">
                {stat.value}
              </dt>
              <dd className="mt-1 text-primary-foreground/60 text-sm">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
