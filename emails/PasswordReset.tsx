import { Heading, Text, Section, Link } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";

interface PasswordResetProps {
  name?: string;
  username?: string;
  resetCode?: string;
}

export const PasswordReset = ({
  name = "there",
  username = "user",
  resetCode = "123456",
}: PasswordResetProps) => {
  return (
    <EmailLayout
      preview="Password reset request received"
      heroImage="/PayMe Fans/Art 09.png"
      heroText="Password Reset Request Received"
    >
      <Heading style={heading}>Hi {name},</Heading>
      <Text style={paragraph}>
        We've received a request to reset the password associated with your
        account <span style={strong}>{username}</span>.
      </Text>
      <Text style={paragraph}>
        If you initiated this request, please use the code below to reset your
        password.
      </Text>
      <Section style={codeSection}>
        <Text style={codeLabel}>Your password reset code:</Text>
        <Section style={codeBlock}>
          <Text style={codeText}>{resetCode}</Text>
        </Section>
        <Text style={codeExpiry}>This code will expire in 15 minutes</Text>
      </Section>
      <Text style={paragraph}>
        If you did not request a password reset, please ignore this email and
        contact our support team immediately at{" "}
        <Link href="mailto:support@paymefans.com" style={linkStyle}>
          support@paymefans.com
        </Link>{" "}
        to ensure the security of your account.
      </Text>
      <Text style={paragraph}>
        Best regards,
        {"\n"}
        The PayMeFans Team
      </Text>
    </EmailLayout>
  );
};

const heading = {
  fontSize: "24px",
  marginBottom: "15px",
  color: "#9d3d8c",
  textAlign: "center" as const,
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  marginBottom: "20px",
  color: "#555",
};

const codeSection = {
  marginBottom: "20px",
};

const codeLabel = {
  textAlign: "center" as const,
  marginBottom: "10px",
  fontSize: "14px",
  color: "#777",
};

const codeBlock = {
  textAlign: "center" as const,
  margin: "20px 0",
};

const codeText = {
  fontFamily: "'Courier New', monospace",
  fontSize: "24px",
  fontWeight: "bold",
  color: "#a94296",
  backgroundColor: "#f8f8f8",
  padding: "15px 25px",
  border: "2px dashed #ddd",
  borderRadius: "8px",
  letterSpacing: "3px",
  display: "inline-block",
  margin: "0",
};

const codeExpiry = {
  textAlign: "center" as const,
  fontSize: "12px",
  color: "#999",
  marginBottom: "20px",
};

const strong = {
  fontWeight: "bold",
};

const linkStyle = {
  color: "#007bff",
  textDecoration: "underline",
};

export default PasswordReset;
