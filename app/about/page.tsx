import { CTA } from "@/components/sections/cta";
import { Features } from "@/components/sections/features";
import { PageHeader } from "@/components/sections/page-header";
import { Stats } from "@/components/sections/stats";
import { Team } from "@/components/sections/team";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata("about", "/about");

const values = [
  {
    title: "Outcome-led",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. We measure everything against the outcomes that matter to your business, not vanity metrics.",
  },
  {
    title: "Radically transparent",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi. No surprises — you'll always know exactly where your project stands.",
  },
  {
    title: "Craft-obsessed",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat. Every detail matters, from the first pixel to the final line of code.",
  },
  {
    title: "Long-term partners",
    description:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt. We invest in relationships, not transactions. Many clients have been with us for years.",
  },
];

const teamMembers = [
  {
    name: "Alex Rivera",
    role: "Founder & CEO",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
  },
  {
    name: "Jordan Kim",
    role: "Head of Design",
    bio: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    name: "Sam Okafor",
    role: "Head of Engineering",
    bio: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id.",
  },
  {
    name: "Casey Lam",
    role: "Head of Growth",
    bio: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
  },
];

const stats = [
  { value: "2012", label: "Year founded" },
  { value: "38", label: "Team members" },
  { value: "14", label: "Countries worked in" },
  { value: "$2B+", label: "Client revenue influenced" },
];

export default function About() {
  return (
    <main>
      <PageHeader
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Northbeam was built by strategists, designers, and engineers who got tired of watching great products fail due to poor execution."
        eyebrow="Our story"
        title="We exist to make ambitious brands grow."
      />

      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <h2 className="font-semibold text-2xl text-foreground tracking-tight">
                Our mission
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-2xl text-foreground tracking-tight">
                How we work
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
                aut fugit, sed quia consequuntur magni dolores eos qui ratione
                voluptatem sequi nesciunt.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Features
        columns={2}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. These aren't just words on a wall — they shape every decision we make."
        eyebrow="Our values"
        features={values}
        title="What we stand for"
      />

      <Team
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. A small, senior team with deep expertise across strategy, design, and engineering."
        eyebrow="The team"
        members={teamMembers}
        title="The people behind the work"
      />

      <Stats stats={stats} />

      <CTA
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. We're always open to hearing about exciting new projects."
        primaryCta={{ label: "Get in touch", href: "/contact" }}
        secondaryCta={{ label: "View services", href: "/services" }}
        title="Let's build something great together."
      />
    </main>
  );
}
