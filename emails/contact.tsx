import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface ContactEmailProps {
  email: string;
  message: string;
  name: string;
  phone?: string;
  siteName?: string;
  siteUrl?: string;
  subject: string;
}

export function ContactEmail({
  name,
  email,
  phone,
  subject,
  message,
  siteName = "Website",
  siteUrl = "#",
}: ContactEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>
        New message from {name}: {subject}
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.brand}>{siteName}</Text>
          <Heading style={styles.heading}>New Contact Form Submission</Heading>
          <Hr style={styles.hr} />

          <Section>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{name}</Text>

            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{email}</Text>

            {phone ? (
              <>
                <Text style={styles.label}>Phone</Text>
                <Text style={styles.value}>{phone}</Text>
              </>
            ) : null}

            <Text style={styles.label}>Subject</Text>
            <Text style={styles.value}>{subject}</Text>
          </Section>

          <Hr style={styles.hr} />

          <Section>
            <Text style={styles.label}>Message</Text>
            <Text style={styles.message}>{message}</Text>
          </Section>

          <Hr style={styles.hr} />

          <Text style={styles.footer}>
            Sent via the contact form on{" "}
            <Link href={siteUrl} style={styles.footerLink}>
              {siteUrl}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

/* v8 ignore next -- development-only preview for the react-email dev server */
export default function ContactEmailPreview() {
  return (
    <ContactEmail
      email="jane@example.com"
      message={`Hi,\n\nI'd love to discuss a potential project with your team. We're looking for a growth studio to help us launch a new product line next quarter.\n\nLooking forward to hearing from you.`}
      name="Jane Smith"
      phone="+1 555 000 0000"
      siteName="Northbeam"
      siteUrl="https://northbeam.com"
      subject="Project inquiry"
    />
  );
}

const styles = {
  body: {
    backgroundColor: "#fafafa",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    margin: "40px auto",
    maxWidth: "560px",
    padding: "40px",
  },
  brand: {
    color: "#171717",
    fontSize: "14px",
    fontWeight: "600",
    letterSpacing: "0.05em",
    margin: "0 0 24px",
    textTransform: "uppercase" as const,
  },
  heading: {
    color: "#171717",
    fontSize: "22px",
    fontWeight: "600",
    margin: "0 0 24px",
  },
  hr: {
    borderColor: "#e4e4e7",
    margin: "24px 0",
  },
  label: {
    color: "#71717a",
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.05em",
    margin: "16px 0 4px",
    textTransform: "uppercase" as const,
  },
  value: {
    color: "#171717",
    fontSize: "15px",
    margin: "0",
  },
  message: {
    color: "#171717",
    fontSize: "15px",
    lineHeight: "1.6",
    margin: "0",
    whiteSpace: "pre-wrap" as const,
  },
  footer: {
    color: "#a1a1aa",
    fontSize: "12px",
    margin: "0",
  },
  footerLink: {
    color: "#a1a1aa",
  },
};
