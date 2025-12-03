import { Heading, Text, Section } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";

interface PurchaseConfirmationProps {
  name?: string;
  productName?: string;
  productPrice?: string;
  orderId?: string;
  date?: string;
}

export const PurchaseConfirmation = ({
  name = "there",
  productName = "Product",
  productPrice = "0",
  orderId = "N/A",
  date = "today",
}: PurchaseConfirmationProps) => {
  return (
    <EmailLayout
      preview="Your purchase was successful"
      heroImage="https://ys837zjc1f.ufs.sh/f/yfhOarqJNTGCalTzHqMhVSewBXju2ofD90QUdgnp5CZNIJlv"
      heroText="Your Purchase Was Successful!"
      showButtons
      primaryButtonText="Track Your Order"
      primaryButtonLink="#"
      secondaryButtonText="Contact Support"
      secondaryButtonLink="#"
    >
      <Heading style={heading}>Hi {name},</Heading>
      <Text style={paragraph}>
        We're thrilled to confirm that your purchase of a{" "}
        <span style={strong}>{productName}</span> on PayMeFans has been
        successful!
      </Text>
      <Section style={detailsSection}>
        <Text style={detailsTitle}>Purchase Details:</Text>
        <Text style={detailsText}>Product: {productName}</Text>
        <Text style={detailsText}>
          Price:{" "}
          {productPrice?.startsWith("₦") || productPrice?.startsWith("$")
            ? productPrice.replace(/^\$/, "₦")
            : `₦${productPrice}`}
        </Text>
        <Text style={detailsText}>Order ID: {orderId}</Text>
        <Text style={detailsText}>Date: {date}</Text>
      </Section>
      <Text style={paragraph}>
        Thank you for shopping with us! We hope you enjoy your purchase.
      </Text>
      <Text style={paragraph}>
        If you have any questions or concerns, please don't hesitate to contact
        our support team.
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

const strong = {
  fontWeight: "bold",
};
export default PurchaseConfirmation;
