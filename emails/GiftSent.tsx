import { Heading, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";

interface GiftSentProps {
  name?: string;
  username?: string;
  points?: string;
}

export const GiftSent = ({
  name = "there",
  username = "user",
  points = "0",
}: GiftSentProps) => {
  return (
    <EmailLayout
      preview="Your gift has been sent"
      heroImage="/PayMe Fans/Art 06.png"
      heroText="Your Gift Points Have Been Sent!"
      showButtons
      primaryButtonText="View Gifting History"
      primaryButtonLink="#"
      secondaryButtonText="Contact Support"
      secondaryButtonLink="#"
    >
      <Heading style={heading}>Hi {name},</Heading>
      <Text style={paragraph}>
        We're thrilled to confirm that your Gift of{" "}
        <span style={strong}>{points} Points</span> has been successfully sent
        to <span style={strong}>{username}</span>!
      </Text>
      <Text style={paragraph}>
        You've shown your appreciation for their amazing content in a thoughtful
        and generous way!
      </Text>
      <Text style={paragraph}>
        Thank you for being an awesome fan and supporting your favorite creators!
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

const strong = {
  fontWeight: "bold",
};

export default GiftSent;
