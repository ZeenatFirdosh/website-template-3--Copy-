import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  answer: string;
  question: string;
}

interface FAQProps {
  description?: string;
  eyebrow?: string;
  items: FAQItem[];
  title: string;
}

export function FAQ({ eyebrow, title, description, items }: FAQProps) {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl">
          {eyebrow && (
            <p className="mb-3 text-center font-semibold text-brand text-sm uppercase tracking-widest">
              {eyebrow}
            </p>
          )}
          <h2 className="text-center font-semibold text-3xl text-foreground tracking-tight sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-center text-lg text-muted-foreground">
              {description}
            </p>
          )}

          <Accordion className="mt-12" collapsible type="single">
            {items.map((item, index) => (
              <AccordionItem key={item.question} value={`item-${index}`}>
                <AccordionTrigger className="text-base text-foreground">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
