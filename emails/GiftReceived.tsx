import { Heading, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";

interface GiftReceivedProps {
  name?: string;
  username?: string;
  points?: string;
}

export const GiftReceived = ({
  name = "there",
  username = "user",
  points = "0",
}: GiftReceivedProps) => {
  return (
    <EmailLayout
      preview="You've received a gift!"
      heroImage="https://ys837zjc1f.ufs.sh/f/yfhOarqJNTGCvR80eTQ5xFzcpqZVBsgLokUlAYJ4mWCydrhO"
      heroText="You've Received a Gift!"
      showButtons
      primaryButtonText="View Your Gifts"
      primaryButtonLink="#"
      secondaryButtonText="Contact Support"
      secondaryButtonLink="#"
    >
      <Heading style={heading}>Hi {name},</Heading>
      <Text style={paragraph}>
        We're excited to inform you that you've received a gift from one of
        your amazing fans!
      </Text>
      <Text style={paragraph}>
        <span style={strong}>{username}</span> has sent you{" "}
        <span style={strong}>{points} Point</span> as a token of appreciation
        for your incredible content!
      </Text>
      <Text style={paragraph}>
        Thank you for creating content that resonates with your audience! We're
        thrilled to see your community showing their love and support.
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

const strong = {
  fontWeight: "bold",
};

export default GiftReceived;
