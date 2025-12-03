import { Heading, Text, Section } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";

interface WithdrawalFailedProps {
  name?: string;
  amount?: string;
  reason?: string;
}

export const WithdrawalFailed = ({
  name = "there",
  amount = "0",
  reason,
}: WithdrawalFailedProps) => {
  return (
    <EmailLayout
      preview="Your withdrawal request has been rejected"
      heroImage="https://ys837zjc1f.ufs.sh/f/yfhOarqJNTGCBbAwjh0WNlSCqngv8AzrEXYUpJMd4fBR3bPs"
      heroText="Withdrawal Rejected"
      showButtons
      primaryButtonText="Contact Support"
      primaryButtonLink="#"
      secondaryButtonText="View Transaction History"
      secondaryButtonLink="#"
    >
      <Heading style={heading}>Dear {name},</Heading>
      <Text style={paragraph}>
        We regret to inform you that your withdrawal request of{" "}
        <span style={strong}>₦{amount}</span> has been rejected.
      </Text>
      {reason && (
        <Section style={reasonSection}>
          <Text style={reasonTitle}>Reason:</Text>
          <Text style={reasonText}>{reason}</Text>
        </Section>
      )}
      <Text style={paragraph}>
        The funds associated with this withdrawal request have been restored to
        your account balance. You can check your account balance and submit a new
        withdrawal request if needed.
      </Text>
      <Text style={paragraph}>
        If you have any questions or concerns about this rejection, please don't
        hesitate to contact our support team. We're here to help.
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

const reasonSection = {
  backgroundColor: "#fff3cd",
  border: "1px solid #ffc107",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
};

const reasonTitle = {
  fontSize: "16px",
  color: "#856404",
  marginBottom: "10px",
  fontWeight: "bold",
};

const reasonText = {
  fontSize: "16px",
  color: "#856404",
  marginBottom: "0",
};

const strong = {
  fontWeight: "bold",
};

export default WithdrawalFailed;

