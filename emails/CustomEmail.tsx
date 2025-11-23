import { Heading, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";

interface CustomEmailProps {
  name?: string;
  subject?: string;
  message?: string;
}

export const CustomEmail = ({
  name = "there",
  subject = "Important Update",
  message = "This is a custom message.",
}: CustomEmailProps) => {
  return (
    <EmailLayout
      preview={subject}
      heroImage="/PayMe Fans/Art 07.png"
      heroText="You're in"
      showButtons
      primaryButtonText="Get Started Now"
      primaryButtonLink="#"
      secondaryButtonText="View Guidelines"
      secondaryButtonLink="#"
    >
      <Heading style={heading}>{subject}</Heading>
      <Text style={paragraph}>Dear {name},</Text>
      <Text style={paragraph}>{message}</Text>
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

export default CustomEmail;
