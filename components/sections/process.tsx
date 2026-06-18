interface ProcessStep {
  description: string;
  number: string;
  title: string;
}

interface ProcessProps {
  description?: string;
  eyebrow?: string;
  steps: ProcessStep[];
  title: string;
}

export function Process({ eyebrow, title, description, steps }: ProcessProps) {
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

        <ol className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li className="flex flex-col gap-4" key={step.title}>
              <span
                aria-hidden="true"
                className="select-none font-bold text-5xl text-muted-foreground/80 tabular-nums"
              >
                {step.number}
              </span>
              <div>
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
