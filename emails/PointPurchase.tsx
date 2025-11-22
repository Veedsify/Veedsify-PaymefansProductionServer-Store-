import { Heading, Text, Section } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";

interface PointPurchaseProps {
  name?: string;
  points?: string;
  transactionId?: string;
}

export const PointPurchase = ({
  name = "there",
  points = "0",
  transactionId = "N/A",
}: PointPurchaseProps) => {
  return (
    <EmailLayout
      preview="Points purchase successful"
      heroImage="/PayMe Fans/Art 08.png"
      heroText="Purchase Successful!"
      showButtons
      primaryButtonText="View My Points"
      primaryButtonLink="#"
      secondaryButtonText="Explore Content"
      secondaryButtonLink="#"
    >
      <Heading style={heading}>Dear {name},</Heading>
      <Text style={paragraph}>
        We're pleased to confirm that your Points purchase on PayMeFans has been
        successfully completed!
      </Text>
      <Section style={detailsSection}>
        <Text style={detailsTitle}>Transaction Details:</Text>
        <Text style={detailsText}>Point Amount: {points} Points</Text>
        <Text style={detailsText}>Transaction ID: {transactionId}</Text>
      </Section>
      <Text style={paragraph}>
        You can use these Points to access exclusive content, support your
        favorite creators, and more!
      </Text>
      <Text style={paragraph}>Thank you for your purchase!</Text>
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

export default PointPurchase;
