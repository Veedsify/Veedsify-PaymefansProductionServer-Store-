import { Heading, Text, Section } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";
import * as React from "react";

interface WelcomeProps {
  name?: string;
}

export const Welcome = ({ name = "there" }: WelcomeProps) => {
  return (
    <EmailLayout
      preview="Welcome to PayMeFans! We're excited to have you join our community."
      heroImage="https://ys837zjc1f.ufs.sh/f/yfhOarqJNTGCtXbq6RTHLoTtFjGmMdfy7BUnCNkXl4bK6Wh8"
      heroText="Welcome to PayMeFans!"
      showButtons
      primaryButtonText="Get Started Now"
      primaryButtonLink="#"
      secondaryButtonText="View Guidelines"
      secondaryButtonLink="#"
    >
      <Heading style={heading}>A Warm Welcome to Our Community!</Heading>
      <Text style={paragraph}>
        We are pleased to have you on board! Thank you for choosing PayMeFans.
        We are delighted to have you as a valued member of our community.
      </Text>
      <Text style={paragraph}>
        To get started, feel free to explore our platform and discover all the
        amazing features we have to offer. If you have any questions or need
        help, our support team is always here to assist you.
      </Text>
      <Text style={paragraph}>
        Thanks again for joining us! We're looking forward to seeing you
        succeed.
      </Text>
      <Text style={paragraph}>
        Best regards,
        {"\n"}
        The PayMeFans Team
      </Text>
    </EmailLayout>
  );
};

export default Welcome;

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
