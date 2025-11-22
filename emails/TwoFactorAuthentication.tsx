import { Heading, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";

interface TwoFactorAuthenticationProps {
  name?: string;
}

export const TwoFactorAuthentication = ({
  name = "there",
}: TwoFactorAuthenticationProps) => {
  return (
    <EmailLayout
      preview="Two-Factor Authentication has been activated"
      heroImage="/PayMe Fans/Art 07 Single.png"
      heroText="Your Account is Now More Secure!"
      showButtons
      primaryButtonText="Manage 2FA Settings"
      primaryButtonLink="#"
      secondaryButtonText="Contact Support"
      secondaryButtonLink="#"
    >
      <Heading style={heading}>Hi {name},</Heading>
      <Text style={paragraph}>
        Your account on PayMeFans is now even more secure!
      </Text>
      <Text style={paragraph}>
        We've successfully activated Two-Factor Authentication (2FA) to protect
        your login credentials. This adds an extra layer of security to prevent
        unauthorized access.
      </Text>
      <Text style={paragraph}>
        <span style={strong}>What this means for you:</span>
      </Text>
      <Text style={listItem}>
        Each time you log in, you'll need to enter a verification code sent to
        your registered phone number or email address.
      </Text>
      <Text style={listItem}>
        Your account is now better protected against phishing, hacking, and
        other malicious activities.
      </Text>
      <Text style={paragraph}>
        <span style={strong}>Keep your login credentials safe:</span>
      </Text>
      <Text style={listItem}>
        Never share your password or 2FA codes with anyone.
      </Text>
      <Text style={listItem}>Use a unique and complex password.</Text>
      <Text style={listItem}>Regularly review your account activity.</Text>
      <Text style={paragraph}>
        If you have any questions or concerns, feel free to contact our support
        team.
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

export default TwoFactorAuthentication;
