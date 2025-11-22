import {
  Heading,
  Text,
  Section,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";

interface OrderItem {
  product: {
    name: string;
    images?: Array<{ image_url: string }>;
  };
  quantity: number;
  price: number;
  size?: {
    name: string;
  } | null;
}

interface OrderConfirmationProps {
  name?: string;
  orderId?: string;
  orderDate?: string;
  items?: OrderItem[];
  totalAmount?: number;
  shippingAddress?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    phone?: string;
  };
}

export const OrderConfirmation = ({
  name = "there",
  orderId = "N/A",
  orderDate = new Date().toLocaleDateString(),
  items = [],
  totalAmount = 0,
  shippingAddress,
}: OrderConfirmationProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  return (
    <EmailLayout
      preview="Your order has been confirmed!"
      heroImage="/PayMe Fans/Art 10.png"
      heroText="Order Confirmed! 🎉"
      showButtons
      primaryButtonText="Track Your Order"
      primaryButtonLink="https://paymefans.shop/orders"
      secondaryButtonText="Contact Support"
      secondaryButtonLink="mailto:support@paymefans.com"
    >
      <Heading style={heading}>Hi {name}!</Heading>
      <Text style={paragraph}>
        Thank you for your order! We're excited to let you know that your
        order has been confirmed and is being prepared for shipment.
      </Text>

      <Section style={orderInfoSection}>
        <Text style={sectionTitle}>Order Information</Text>
        <Row>
          <Column style={infoColumn}>
            <Text style={infoLabel}>Order ID</Text>
            <Text style={infoValue}>{orderId}</Text>
          </Column>
          <Column style={infoColumn}>
            <Text style={infoLabel}>Order Date</Text>
            <Text style={infoValue}>{orderDate}</Text>
          </Column>
        </Row>
      </Section>

      <Section style={itemsSection}>
        <Text style={sectionTitle}>Order Items</Text>
        {items.map((item, index) => (
          <Section key={index} style={itemRow}>
            <Row>
              <Column style={itemInfoColumn}>
                <Text style={itemName}>{item.product.name}</Text>
                {item.size && (
                  <Text style={itemSize}>Size: {item.size.name}</Text>
                )}
                <Text style={itemQuantity}>Quantity: {item.quantity}</Text>
              </Column>
              <Column style={itemPriceColumn}>
                <Text style={itemPrice}>
                  {formatCurrency(item.price * item.quantity)}
                </Text>
              </Column>
            </Row>
          </Section>
        ))}
      </Section>

      {shippingAddress && (
        <Section style={shippingSection}>
          <Text style={sectionTitle}>Shipping Address</Text>
          <Text style={addressText}>
            {shippingAddress.name && <strong>{shippingAddress.name}</strong>}
            {shippingAddress.name && <br />}
            {shippingAddress.address}
            <br />
            {shippingAddress.city}, {shippingAddress.state}
            <br />
            {shippingAddress.country}
            {shippingAddress.phone && (
              <>
                <br />
                Phone: {shippingAddress.phone}
              </>
            )}
          </Text>
        </Section>
      )}

      <Section style={totalSection}>
        <Row>
          <Column style={totalLabelColumn}>
            <Text style={totalLabel}>Total Amount</Text>
          </Column>
          <Column style={totalValueColumn}>
            <Text style={totalValue}>{formatCurrency(totalAmount)}</Text>
          </Column>
        </Row>
      </Section>

      <Text style={paragraph}>
        We'll send you another email when your order ships. You can track your
        order status anytime from your account.
      </Text>

      <Text style={paragraph}>
        If you have any questions about your order, please don't hesitate to
        contact our support team at{" "}
        <a href="mailto:support@paymefans.com" style={link}>
          support@paymefans.com
        </a>
        .
      </Text>

      <Text style={paragraph}>
        Best regards,
        <br />
        The PayMeFans Store Team
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

const orderInfoSection = {
  backgroundColor: "#f9f9f9",
  border: "1px solid #eaeaea",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
};

const sectionTitle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#4a4a4a",
  marginBottom: "15px",
};

const infoColumn = {
  width: "50%",
  verticalAlign: "top" as const,
  paddingRight: "10px",
};

const infoLabel = {
  fontSize: "14px",
  color: "#777",
  marginBottom: "5px",
};

const infoValue = {
  fontSize: "16px",
  color: "#4a4a4a",
  fontWeight: "bold",
  marginBottom: "10px",
};

const itemsSection = {
  backgroundColor: "#ffffff",
  border: "1px solid #eaeaea",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
};

const itemRow = {
  borderBottom: "1px solid #eaeaea",
  paddingBottom: "15px",
  marginBottom: "15px",
};

const itemInfoColumn = {
  width: "70%",
  verticalAlign: "top" as const,
};

const itemPriceColumn = {
  width: "30%",
  textAlign: "right" as const,
  verticalAlign: "top" as const,
};

const itemName = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#4a4a4a",
  marginBottom: "5px",
};

const itemSize = {
  fontSize: "14px",
  color: "#777",
  marginBottom: "5px",
};

const itemQuantity = {
  fontSize: "14px",
  color: "#777",
  marginBottom: "0",
};

const itemPrice = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#9d3d8c",
  marginBottom: "0",
};

const shippingSection = {
  backgroundColor: "#f9f9f9",
  border: "1px solid #eaeaea",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
};

const addressText = {
  fontSize: "16px",
  color: "#4a4a4a",
  lineHeight: "1.6",
  marginBottom: "0",
};

const totalSection = {
  backgroundColor: "#9d3d8c",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
};

const totalLabelColumn = {
  width: "70%",
  verticalAlign: "middle" as const,
};

const totalValueColumn = {
  width: "30%",
  textAlign: "right" as const,
  verticalAlign: "middle" as const,
};

const totalLabel = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#ffffff",
  marginBottom: "0",
};

const totalValue = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#ffffff",
  marginBottom: "0",
};

const link = {
  color: "#9d3d8c",
  textDecoration: "underline",
};

export default OrderConfirmation;

