import { Heading, Text, Section, Link } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";

interface VerificationCodeProps {
  name?: string;
  code?: string;
}

export const VerificationCode = ({
  name = "there",
  code = "123456",
}: VerificationCodeProps) => {
  return (
    <EmailLayout
      preview="Your verification code"
      heroImage="https://ys837zjc1f.ufs.sh/f/yfhOarqJNTGCWO68cSEI7bDUMgZBcSxVtwrufO5j1mPqCX9s"
      heroText="Your Verification Code"
    >
      <Heading style={heading}>Hi {name},</Heading>
      <Text style={paragraph}>
        We've received a request to verify your account. Please use the code
        below to complete the verification process.
      </Text>
      <Section style={codeSection}>
        <Text style={codeLabel}>Your verification code:</Text>
        <Section style={codeBlock}>
          <Text style={codeText}>{code}</Text>
        </Section>
        <Text style={codeExpiry}>This code will expire in 15 minutes</Text>
      </Section>
      <Text style={paragraph}>
        If you did not request this verification, please ignore this email and
        contact our support team immediately at{" "}
        <Link href="mailto:support@paymefans.com" style={linkStyle}>
          support@paymefans.com
        </Link>
        .
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
  color: "#cc0df8",
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
  color: "#cc0df8",
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

const linkStyle = {
  color: "#cc0df8",
  textDecoration: "underline",
};

export default VerificationCode;
