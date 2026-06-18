interface PageHeaderProps {
  description?: string;
  eyebrow?: string;
  title: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="border-border border-b bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        {eyebrow && (
          <p className="mb-3 font-semibold text-brand text-sm uppercase tracking-widest">
            {eyebrow}
          </p>
        )}
        <h1 className="font-semibold text-3xl text-foreground tracking-tight sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
