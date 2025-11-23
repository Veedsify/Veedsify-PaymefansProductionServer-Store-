import { Heading, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";

interface UserBannedProps {
  name?: string;
}

export const UserBanned = ({ name = "there" }: UserBannedProps) => {
  return (
    <EmailLayout
      preview="Important account notice"
      heroImage="https://ys837zjc1f.ufs.sh/f/yfhOarqJNTGC4N8u1G7gJC6t5OkBIHRLqnrX4E7mGgyQVszc"
      heroText="Important Notice"
      showButtons
      primaryButtonText="Contact Support"
      primaryButtonLink="#"
    >
      <Heading style={heading}>Dear {name},</Heading>
      <Text style={paragraph}>
        We regret to inform you that your account on PayMeFans has been banned,
        effective immediately.
      </Text>
      <Text style={paragraph}>
        This decision was made after a thorough investigation into reports
        received from other users, which alleged that your account was in
        violation of our platform's Terms of Service and Privacy Policy.
      </Text>
      <Text style={paragraph}>
        Our investigation revealed that these allegations were true, and your
        actions were found to be in breach of our community guidelines.
        Specifically:
      </Text>
      <Text style={listItem}>Harassment of other users.</Text>
      <Text style={listItem}>
        Posting or sharing child exploitation material (if applicable).
      </Text>
      <Text style={listItem}>
        Impersonation or identity theft, including pretending to be someone
        else.
      </Text>
      <Text style={paragraph}>
        We take these violations seriously and are committed to maintaining a
        safe and respectful environment for all users. As a result, we have been
        left with no choice but to ban your account.
      </Text>
      <Text style={paragraph}>
        Please note that this decision is final and irreversible. If you have
        any questions or concerns, please feel free to contact our support team.
      </Text>
      <Text style={paragraph}>
        Sincerely,
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

const listItem = {
  fontSize: "16px",
  lineHeight: "1.6",
  marginBottom: "10px",
  color: "#555",
  paddingLeft: "20px",
};

export default UserBanned;
