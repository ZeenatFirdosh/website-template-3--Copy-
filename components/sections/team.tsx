interface TeamMember {
  bio: string;
  name: string;
  role: string;
}

interface TeamProps {
  description?: string;
  eyebrow?: string;
  members: TeamMember[];
  title: string;
}

function memberInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Team({ eyebrow, title, description, members }: TeamProps) {
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

        <ul className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member) => (
            <li className="flex flex-col gap-4" key={member.name}>
              <div
                aria-hidden="true"
                className="flex h-16 w-16 items-center justify-center rounded-full bg-primary font-semibold text-lg text-primary-foreground"
              >
                {memberInitials(member.name)}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{member.name}</h3>
                <p className="text-brand text-sm">{member.role}</p>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
