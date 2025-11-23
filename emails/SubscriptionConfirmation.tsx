import { Heading, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";

interface SubscriptionConfirmationProps {
  name?: string;
  username?: string;
  duration?: string;
}

export const SubscriptionConfirmation = ({
  name = "there",
  username = "creator",
  duration = "1 month",
}: SubscriptionConfirmationProps) => {
  return (
    <EmailLayout
      preview="Welcome to exclusive content!"
      heroImage="https://ys837zjc1f.ufs.sh/f/yfhOarqJNTGCBLrtdUB0WNlSCqngv8AzrEXYUpJMd4fBR3bP"
      heroText={`Welcome to ${username}'s Exclusive Content!`}
      showButtons
      primaryButtonText="Explore Exclusive Content"
      primaryButtonLink="#"
      secondaryButtonText="Manage Subscription"
      secondaryButtonLink="#"
    >
      <Heading style={heading}>Dear {name},</Heading>
      <Text style={paragraph}>
        We're excited to welcome you to {username}'s exclusive content!
      </Text>
      <Text style={paragraph}>
        You've successfully subscribed to{" "}
        <span style={strong}>@{username}</span> for {duration}, and we're
        thrilled to offer you:
      </Text>
      <Text style={listItem}>
        Access to exclusive content, including photos, videos, and more.
      </Text>
      <Text style={listItem}>
        Priority access to new content, updates, and announcements.
      </Text>
      <Text style={paragraph}>
        Your subscription will automatically renew at the end of the {duration}{" "}
        period, but you can cancel anytime.
      </Text>
      <Text style={paragraph}>
        Thank you for supporting @{username}. Enjoy the exclusive content and
        benefits!
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

const listItem = {
  fontSize: "16px",
  lineHeight: "1.6",
  marginBottom: "10px",
  color: "#555",
  paddingLeft: "20px",
};

const strong = {
  fontWeight: "bold",
};

export default SubscriptionConfirmation;
