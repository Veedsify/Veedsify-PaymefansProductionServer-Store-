import { Heading, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";

interface WithdrawalProcessingProps {
  name?: string;
  amount?: string;
}

export const WithdrawalProcessing = ({
  name = "there",
  amount = "0",
}: WithdrawalProcessingProps) => {
  return (
    <EmailLayout
      preview="Your withdrawal is being processed"
      heroImage="https://ys837zjc1f.ufs.sh/f/yfhOarqJNTGCBbAwjh0WNlSCqngv8AzrEXYUpJMd4fBR3bPs"
      heroText="Withdrawal Processing!"
      showButtons
      primaryButtonText="View Withdrawal Status"
      primaryButtonLink="#"
      secondaryButtonText="Contact Support"
      secondaryButtonLink="#"
    >
      <Heading style={heading}>Dear {name},</Heading>
      <Text style={paragraph}>
        We've received your withdrawal request of{" "}
        <span style={strong}>₦{amount}</span> on PayMeFans and are pleased to
        inform you that it's currently being processed.
      </Text>
      <Text style={paragraph}>
        Please note that our standard processing time for withdrawals is{" "}
        <span style={strong}>24 hours</span>. Once processed, the funds will be
        transferred to your designated payout method.
      </Text>
      <Text style={paragraph}>
        We'll review your withdrawal request and verify the payout details. If
        everything is in order, you can expect to receive your payout within the
        next 24 hours.
      </Text>
      <Text style={paragraph}>
        You'll receive a confirmation email with the payout details once the
        processing is complete. If there are any issues with your request, our
        team will reach out to you promptly.
      </Text>
      <Text style={paragraph}>Thank you for your patience.</Text>
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

export default WithdrawalProcessing;
