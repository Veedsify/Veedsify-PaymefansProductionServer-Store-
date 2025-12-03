import { Heading, Text, Section } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";

interface ConfirmWithdrawalProps {
  name?: string;
  amount?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
}

export const ConfirmWithdrawal = ({
  name = "there",
  amount = "0",
  bankName = "N/A",
  accountNumber = "N/A",
  accountName = "N/A",
}: ConfirmWithdrawalProps) => {
  return (
    <EmailLayout
      preview="Withdrawal request confirmed"
      heroImage="https://ys837zjc1f.ufs.sh/f/yfhOarqJNTGCbYHF08kB8NpSM64osEwqJglatDvYIXzU5hc1"
      heroText="Withdrawal Processing!"
      showButtons
      primaryButtonText="View Withdrawal Status"
      primaryButtonLink="#"
      secondaryButtonText="Contact Support"
      secondaryButtonLink="#"
    >
      <Heading style={heading}>Dear {name},</Heading>
      <Text style={paragraph}>
        We have received your withdrawal request of{" "}
        <span style={strong}>₦{amount}</span> from your PayMeFans account.
      </Text>
      <Text style={paragraph}>
        <span style={strong}>Withdrawal Details:</span>
      </Text>
      <Section style={detailsSection}>
        <Text style={detailsText}>
          <span style={strong}>Amount:</span> ₦{amount}
        </Text>
        <Text style={detailsText}>
          <span style={strong}>Bank Name:</span> {bankName}
        </Text>
        <Text style={detailsText}>
          <span style={strong}>Account Number:</span> {accountNumber}
        </Text>
        <Text style={detailsText}>
          <span style={strong}>Account Name:</span> {accountName}
        </Text>
      </Section>
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

const detailsSection = {
  backgroundColor: "#f9f9f9",
  padding: "15px",
  borderRadius: "5px",
  margin: "15px 0",
};

const detailsText = {
  fontSize: "16px",
  color: "#4a4a4a",
  marginBottom: "10px",
};

const strong = {
  fontWeight: "bold",
};

export default ConfirmWithdrawal;
