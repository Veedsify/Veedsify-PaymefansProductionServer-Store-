import { Heading, Text, Link } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";
import * as React from "react";

interface PasswordChangedProps {
  name?: string;
  username?: string;
}

export const PasswordChanged = ({
  name = "there",
  username = "user",
}: PasswordChangedProps) => {
  return (
    <EmailLayout
      preview="Your password has been changed"
      heroImage="https://ys837zjc1f.ufs.sh/f/yfhOarqJNTGCOd5r0rxa2UeHVCqJO7iKXZlwSnW9Q3ELdT6f"
      heroText="Your Password Has Been Changed!"
      showButtons
      primaryButtonText="Log In Now"
      primaryButtonLink="#"
      secondaryButtonText="Contact Support"
      secondaryButtonLink="#"
    >
      <Heading style={heading}>Hi {name},</Heading>
      <Text style={paragraph}>
        This is to confirm that your <span style={strong}>{username}</span>{" "}
        account password has been successfully changed.
      </Text>
      <Text style={paragraph}>
        You can now log in to your account using your new password. If you have
        any issues or concerns, please don't hesitate to contact our support
        team at{" "}
        <Link href="mailto:support@paymefans.com" style={linkStyle}>
          support@paymefans.com
        </Link>
        .
      </Text>
      <Text style={paragraph}>
        Thank you for maintaining the security of your account!
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

const linkStyle = {
  color: "#cc0df8",
  textDecoration: "underline",
};

export default PasswordChanged;
