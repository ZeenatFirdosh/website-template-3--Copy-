import { CTA } from "@/components/sections/cta";
import { Features } from "@/components/sections/features";
import { PageHeader } from "@/components/sections/page-header";
import { Pricing } from "@/components/sections/pricing";
import { Process } from "@/components/sections/process";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata("services", "/services");

const services = [
  {
    title: "Brand Strategy",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. We develop positioning, messaging, and identity systems that differentiate your brand and resonate with your target audience at every touchpoint.",
  },
  {
    title: "Web Design & Development",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi. High-performance websites and web apps, built with modern frameworks and optimised for speed, accessibility, and conversions.",
  },
  {
    title: "Product Launch",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore. End-to-end launch support — from pre-launch strategy and waitlist building to post-launch acquisition and growth loops.",
  },
  {
    title: "Performance Marketing",
    description:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia. Paid search, paid social, and programmatic campaigns managed with relentless focus on ROAS and cost-per-acquisition.",
  },
  {
    title: "Content & SEO",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque. Editorial strategy, long-form content, and technical SEO that drives compounding organic traffic growth.",
  },
  {
    title: "Analytics & Optimisation",
    description:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit. Full-funnel analytics setup, A/B testing programmes, and data-driven optimisation to lift conversion rates.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. We dig deep into your business, market, and goals before recommending a single solution.",
  },
  {
    number: "02",
    title: "Strategy",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation. We build a clear roadmap with defined milestones, owners, and success metrics.",
  },
  {
    number: "03",
    title: "Execution",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate. Our team moves fast, iterates often, and keeps you in the loop at every step.",
  },
  {
    number: "04",
    title: "Growth",
    description:
      "Excepteur sint occaecat cupidatat non proident. We measure, learn, and scale what works — then repeat the cycle.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$4,500",
    period: "/ month",
    description:
      "Lorem ipsum dolor sit amet for early-stage teams ready to establish a strong foundation.",
    features: [
      "Brand strategy session",
      "Landing page design & build",
      "Basic SEO setup",
      "Monthly performance report",
      "Email support",
    ],
    cta: { label: "Get started", href: "/contact" },
  },
  {
    name: "Growth",
    price: "$9,500",
    period: "/ month",
    description:
      "Ut enim ad minim veniam for scale-stage companies looking to accelerate across all channels.",
    features: [
      "Everything in Starter",
      "Performance marketing campaigns",
      "Content & SEO programme",
      "Conversion rate optimisation",
      "Weekly strategy calls",
      "Dedicated account manager",
    ],
    featured: true,
    cta: { label: "Get started", href: "/contact" },
  },
  {
    name: "Enterprise",
    price: "Custom",
    description:
      "Duis aute irure dolor for established businesses that need a full-service embedded growth team.",
    features: [
      "Everything in Growth",
      "Custom analytics infrastructure",
      "Dedicated engineering resource",
      "Board-level reporting",
      "SLA guarantees",
      "On-site workshops",
    ],
    cta: { label: "Contact us", href: "/contact" },
  },
];

export default function Services() {
  return (
    <main>
      <PageHeader
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. From first touchpoint to loyal customer, we cover every stage of the growth journey."
        eyebrow="Services"
        title="A full suite of growth services."
      />

      <Features
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Whether you need a single discipline or an integrated team, we have the expertise to deliver."
        eyebrow="What we offer"
        features={services}
        title="Capabilities built for growth"
      />

      <Process
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. A clear, repeatable process that delivers predictable outcomes — every time."
        eyebrow="How we work"
        steps={processSteps}
        title="Our process"
      />

      <Pricing
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. No hidden fees, no surprise invoices. Pick the plan that fits where you are today."
        eyebrow="Pricing"
        plans={pricingPlans}
        title="Simple, transparent pricing"
      />

      <CTA
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Book a free 30-minute discovery call and we'll help you figure out the best fit."
        primaryCta={{ label: "Book a call", href: "/contact" }}
        title="Not sure which plan is right for you?"
      />
    </main>
  );
}
