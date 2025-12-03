import { Heading, Text, Section } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";

interface InitiateWithdrawalProps {
  name?: string;
  amount?: string;
  code?: string;
}

export const InitiateWithdrawal = ({
  name = "there",
  amount = "0",
  code = "000000",
}: InitiateWithdrawalProps) => {
  return (
    <EmailLayout
      preview="Withdrawal verification code"
      heroImage="https://ys837zjc1f.ufs.sh/f/yfhOarqJNTGCrduj9b8GSCzsvD6hInWLZqR9k5XPQ83rxE7H"
      heroText="Withdrawal Processing!"
      showButtons
      primaryButtonText="View Withdrawal Status"
      primaryButtonLink="#"
      secondaryButtonText="Contact Support"
      secondaryButtonLink="#"
    >
      <Heading style={heading}>Dear {name},</Heading>
      <Text style={paragraph}>
        We have received your withdrawal request of{" "}
        <span style={strong}>₦{amount}</span> from your PayMeFans account.
      </Text>
      <Text style={paragraph}>
        Use the verification code below to confirm your identity and complete
        the withdrawal process:
      </Text>
      <Section style={codeSection}>
        <Section style={codeBlock}>
          <Text style={codeText}>{code}</Text>
        </Section>
      </Section>
      <Text style={paragraph}>
        Please note that this code is valid for{" "}
        <span style={strong}>10 minutes</span>. If you did not initiate this
        request, please ignore this email.
      </Text>
      <Text style={paragraph}>Thank you for your patience.</Text>
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

const codeBlock = {
  textAlign: "center" as const,
  margin: "20px 0",
};

const codeText = {
  fontFamily: "'Courier New', monospace",
  fontSize: "32px",
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

const strong = {
  fontWeight: "bold",
};

export default InitiateWithdrawal;
