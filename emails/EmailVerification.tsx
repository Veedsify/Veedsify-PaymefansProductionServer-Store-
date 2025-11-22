import { Heading, Text } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";
import * as React from "react";

interface EmailVerificationProps {
  name?: string;
  link?: string;
}

export const EmailVerification = ({
  name = "there",
  link = "https://paymefans.com/verify",
}: EmailVerificationProps) => {
  return (
    <EmailLayout
      preview="Please verify your email address"
      heroImage="/PayMe Fans/verification.webp"
      heroText="Confirm Your Email Address"
      showButtons
      primaryButtonText="Verify My Email"
      primaryButtonLink={link}
    >
      <Heading style={heading}>Hi {name},</Heading>
      <Text style={paragraph}>Thanks for signing up on PayMeFans!</Text>
      <Text style={paragraph}>
        To complete your registration and access all features, we need to verify
        your email address.
      </Text>
      <Text style={paragraph}>
        Please click the button above to confirm your email.
      </Text>
      <Text style={paragraph}>
        If you have any issues, feel free to contact our support team.
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

export default EmailVerification;
