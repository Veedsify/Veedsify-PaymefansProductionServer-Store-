import { Heading, Text, Section } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";

interface WithdrawalSuccessfulProps {
  name?: string;
  amount?: string;
  transactionId?: string;
}

export const WithdrawalSuccessful = ({
  name = "there",
  amount = "0",
  transactionId = "N/A",
}: WithdrawalSuccessfulProps) => {
  return (
    <EmailLayout
      preview="Your withdrawal has been processed successfully"
      heroImage="https://ys837zjc1f.ufs.sh/f/yfhOarqJNTGCJc36wFMjjaBGD0ZIxKJL1tCkoF37AcTMXwV8"
      heroText="Withdrawal Successful!"
      showButtons
      primaryButtonText="View Transaction History"
      primaryButtonLink="#"
      secondaryButtonText="Contact Support"
      secondaryButtonLink="#"
    >
      <Heading style={heading}>Dear {name},</Heading>
      <Text style={paragraph}>
        We're pleased to inform you that your withdrawal request on PayMeFans
        has been successfully processed!
      </Text>
      <Text style={paragraph}>
        The funds have been sent to your designated payout method, and you
        should receive them shortly.
      </Text>
      <Section style={detailsSection}>
        <Text style={detailsTitle}>Transaction Details:</Text>
        <Text style={detailsText}>Withdrawal Amount: ₦{amount}</Text>
        <Text style={detailsText}>Transaction ID: {transactionId}</Text>
      </Section>
      <Text style={paragraph}>
        Please note that the availability of the funds may vary depending on
        your payout method and bank's processing times.
      </Text>
      <Text style={paragraph}>
        Thank you for using PayMeFans! If you have any questions or concerns,
        feel free to contact our support team.
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

const detailsSection = {
  backgroundColor: "#f9f9f9",
  border: "1px solid #eaeaea",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
};

const detailsTitle = {
  fontSize: "16px",
  color: "#4a4a4a",
  marginBottom: "10px",
  fontWeight: "bold",
};

const detailsText = {
  fontSize: "16px",
  color: "#4a4a4a",
  marginBottom: "10px",
};

export default WithdrawalSuccessful;
