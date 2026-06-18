interface Testimonial {
  company: string;
  content: string;
  name: string;
  role: string;
}

interface TestimonialsProps {
  description?: string;
  eyebrow?: string;
  testimonials: Testimonial[];
  title: string;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Testimonials({
  eyebrow,
  title,
  description,
  testimonials,
}: TestimonialsProps) {
  return (
    <section className="bg-surface py-20 sm:py-28">
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

        <ul className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <li key={t.name}>
              <figure className="flex h-full flex-col gap-6 rounded-xl border border-border bg-background p-8">
                <blockquote className="flex-1">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    &ldquo;{t.content}&rdquo;
                  </p>
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <div
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground text-xs"
                  >
                    {initials(t.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {t.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
