import { Heading, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";

interface VerificationCompleteProps {
  name?: string;
}

export const VerificationComplete = ({
  name = "there",
}: VerificationCompleteProps) => {
  return (
    <EmailLayout
      preview="Your verification is complete!"
      heroImage="https://ys837zjc1f.ufs.sh/f/yfhOarqJNTGCuZxlNm68mHovFOWUKatPuCNTQqx9lyk03EL2"
      heroText="Verification Complete!"
      showButtons
      primaryButtonText="Go to Dashboard"
      primaryButtonLink="#"
      secondaryButtonText="Contact Support"
      secondaryButtonLink="#"
    >
      <Heading style={heading}>Congratulations, {name}!</Heading>
      <Text style={paragraph}>
        We're pleased to inform you that your verification is now complete!
      </Text>
      <Text style={paragraph}>
        Our team has reviewed and approved the information you provided, and
        your account is now fully activated.
      </Text>
      <Text style={paragraph}>
        Thank you for taking the time to provide the necessary details. You can
        now access all the features and benefits of our platform.
      </Text>
      <Text style={paragraph}>
        If you have any questions or need assistance, our support team is always
        here to help.
      </Text>
      <Text style={paragraph}>
        Congratulations again, and welcome to our community!
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

export default VerificationComplete;
