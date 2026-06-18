import {
  BarChart3Icon,
  LightbulbIcon,
  MegaphoneIcon,
  PenToolIcon,
  RocketIcon,
  TargetIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { CTA } from "@/components/sections/cta";
import { FAQ } from "@/components/sections/faq";
import { Features } from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { Testimonials } from "@/components/sections/testimonials";

// DO NOT EDIT — update page content in lib/site.ts instead
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const features = [
  {
    icon: <LightbulbIcon aria-hidden="true" className="h-5 w-5" />,
    title: "Brand Strategy",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus, malesuada fames.",
  },
  {
    icon: <PenToolIcon aria-hidden="true" className="h-5 w-5" />,
    title: "Web Design",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis.",
  },
  {
    icon: <RocketIcon aria-hidden="true" className="h-5 w-5" />,
    title: "Product Launch",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur.",
  },
  {
    icon: <MegaphoneIcon aria-hidden="true" className="h-5 w-5" />,
    title: "Performance Marketing",
    description:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    icon: <TargetIcon aria-hidden="true" className="h-5 w-5" />,
    title: "Conversion Optimisation",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam.",
  },
  {
    icon: <BarChart3Icon aria-hidden="true" className="h-5 w-5" />,
    title: "Growth Analytics",
    description:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos.",
  },
];

const stats = [
  { value: "200+", label: "Clients served" },
  { value: "98%", label: "Client retention rate" },
  { value: "3×", label: "Average revenue growth" },
  { value: "12 yrs", label: "Industry experience" },
];

const testimonials = [
  {
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eu nisi vel lorem venenatis sodales. Working with this team transformed our growth trajectory completely.",
    name: "Sarah Johnson",
    role: "CEO",
    company: "Apex Ventures",
  },
  {
    content:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi. Their strategic approach and attention to detail is second to none. Highly recommend.",
    name: "Marcus Chen",
    role: "Head of Growth",
    company: "Flux Digital",
  },
  {
    content:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore. They delivered results that exceeded every expectation we had set for the project.",
    name: "Priya Nair",
    role: "Founder",
    company: "Mosaic Co.",
  },
];

const faqs = [
  {
    question: "How long does a typical project take?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Timelines vary based on scope, but most projects are delivered within 4–12 weeks.",
  },
  {
    question: "Do you work with early-stage startups?",
    answer:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo. We partner with companies at every stage — from pre-seed founders to established enterprises looking to scale.",
  },
  {
    question: "What does onboarding look like?",
    answer:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. We start with a discovery call to understand your goals, then build a tailored roadmap before any work begins.",
  },
  {
    question: "Can we work with you on a retainer basis?",
    answer:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Yes — many of our clients move to a monthly retainer after an initial project engagement.",
  },
  {
    question: "How do you measure success?",
    answer:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. We agree on clear KPIs at the start of every engagement and report against them throughout the project.",
  },
];

export default function Home() {
  return (
    <main>
      <Hero
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. We partner with ambitious brands to build, launch, and grow products that make a lasting impact."
        eyebrow="Growth Studio"
        primaryCta={{ label: "Start a project", href: "/contact" }}
        secondaryCta={{ label: "Our services", href: "/services" }}
        title="Launch faster. Convert better. Scale with confidence."
      />

      <Features
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. From strategy through to execution, we cover every discipline a modern growth team needs."
        eyebrow="What we do"
        features={features}
        title="Everything you need to grow"
      />

      <Stats stats={stats} />

      <Testimonials
        eyebrow="Client stories"
        testimonials={testimonials}
        title="Trusted by ambitious teams"
      />

      <FAQ
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Can't find what you're looking for? Reach out and we'll reply within one business day."
        eyebrow="FAQ"
        items={faqs}
        title="Common questions"
      />

      <CTA
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tell us about your project and we'll get back to you within one business day."
        primaryCta={{ label: "Start a project", href: "/contact" }}
        secondaryCta={{ label: "Learn about us", href: "/about" }}
        title="Ready to build something worth talking about?"
      />
    </main>
  );
}
