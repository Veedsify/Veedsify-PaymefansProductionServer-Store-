import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface EmailLayoutProps {
  children: React.ReactNode;
  preview?: string;
  heroImage?: string;
  heroText?: string;
  showButtons?: boolean;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export const EmailLayout = ({
  children,
  preview,
  heroImage,
  heroText,
  showButtons = false,
  primaryButtonText,
  primaryButtonLink = "#",
  secondaryButtonText,
  secondaryButtonLink = "#",
}: EmailLayoutProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <Html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        `}</style>
      </Head>
      {preview && <Preview>{preview}</Preview>}
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Row>
              <Column style={logoColumn}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  style={logo}
                  fill="currentColor"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </Column>
              <Column style={navButtonColumn}>
                <Link href="https://paymefans.com/profile" style={navButton}>
                  Navigate to Profile
                </Link>
              </Column>
            </Row>
          </Section>

          {/* Hero Image */}
          {heroImage && (
            <Section style={heroImageSection}>
              <Img
                src={heroImage}
                alt={heroText || "Hero Image"}
                width="600"
                height="200"
                style={heroImageStyle}
              />
            </Section>
          )}
          {heroText && (
            <Section style={heroTextSection}>
              <Text style={heroTextStyle}>{heroText}</Text>
            </Section>
          )}

          {/* Content */}
          <Section style={content}>{children}</Section>

          {/* Button Section */}
          {showButtons && (
            <Section style={buttonSection}>
              {primaryButtonText && (
                <Link href={primaryButtonLink} style={primaryButton}>
                  {primaryButtonText}
                </Link>
              )}
              {secondaryButtonText && (
                <Link href={secondaryButtonLink} style={secondaryButton}>
                  {secondaryButtonText}
                </Link>
              )}
            </Section>
          )}

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>PayMeFans Ltd. &copy; {currentYear}</Text>
            <Text style={footerText}>
              <Link href="#" style={footerLink}>
                Privacy Policy
              </Link>{" "}
              |{" "}
              <Link href="#" style={footerLink}>
                Terms of Service
              </Link>
            </Text>
            <Text style={footerText}>
              <Link href="#" style={footerLink}>
                Unsubscribe
              </Link>{" "}
              ·{" "}
              <Link href="#" style={footerLink}>
                Notification Settings
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  fontFamily:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  backgroundColor: "#ffffff",
  color: "#4a4a4a",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#fff",
  borderRadius: "10px",
  overflow: "hidden",
};

const header = {
  backgroundColor: "#fafafa",
  borderBottom: "1px solid #eaeaea",
  padding: "20px",
};

const logoColumn = {
  width: "50%",
  verticalAlign: "top" as const,
};

const logo = {
  color: "#a94296",
  height: "40px",
};

const navButtonColumn = {
  width: "50%",
  textAlign: "right" as const,
  verticalAlign: "top" as const,
};

const navButton = {
  display: "inline-block",
  padding: "8px 15px",
  backgroundColor: "#a94296",
  color: "#fff",
  textDecoration: "none",
  fontSize: "14px",
  borderRadius: "5px",
};

const heroImageSection = {
  width: "100%",
  marginBottom: "0",
};

const heroImageStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover" as const,
  display: "block",
};

const heroTextSection = {
  width: "100%",
  textAlign: "center" as const,
  backgroundColor: "#333",
  padding: "15px 20px",
  marginTop: "-5px",
};

const heroTextStyle = {
  fontSize: "28px",
  color: "#fff",
  margin: "0",
  textAlign: "center" as const,
};

const content = {
  padding: "30px 20px",
  textAlign: "left" as const,
};

const buttonSection = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const primaryButton = {
  display: "inline-block",
  padding: "12px 25px",
  backgroundColor: "#a94296",
  color: "#fff",
  textDecoration: "none",
  borderRadius: "25px",
  fontSize: "16px",
  margin: "0 10px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const secondaryButton = {
  display: "inline-block",
  padding: "12px 25px",
  backgroundColor: "#f0f0f0",
  color: "#4a4a4a",
  textDecoration: "none",
  borderRadius: "25px",
  fontSize: "16px",
  margin: "0 10px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const footer = {
  backgroundColor: "#fafafa",
  borderTop: "1px solid #eaeaea",
  textAlign: "center" as const,
  padding: "20px",
};

const footerText = {
  fontSize: "14px",
  color: "#777",
  marginBottom: "10px",
  margin: "0 0 10px 0",
};

const footerLink = {
  fontSize: "12px",
  color: "#aaa",
  textDecoration: "none",
  margin: "0 10px",
};
