import { Heading, Text, Section } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";

interface NewSubscriberProps {
  name?: string;
  username?: string;
  duration?: string;
  date?: string;
}

export const NewSubscriber = ({
  name = "there",
  username = "user",
  duration = "30",
  date = "today",
}: NewSubscriberProps) => {
  return (
    <EmailLayout
      preview="You have a new subscriber!"
      heroImage="/PayMe Fans/Art 10.png"
      heroText="New Subscriber Alert!"
      showButtons
      primaryButtonText="View Subscriber List"
      primaryButtonLink="#"
    >
      <Heading style={heading}>Hi {name},</Heading>
      <Text style={paragraph}>
        We're excited to inform you that{" "}
        <span style={strong}>@{username}</span> has subscribed to your exclusive
        content for 1 month!
      </Text>
      <Text style={paragraph}>
        Their subscription is now active, and they'll enjoy access to your
        exclusive content, updates, pictures, and videos.
      </Text>
      <Text style={paragraph}>
        Thank you for sharing your amazing content with our community! We're
        thrilled to see your fan base grow.
      </Text>
      <Section style={detailsSection}>
        <Text style={detailsTitle}>Subscription Details:</Text>
        <Text style={detailsText}>Subscriber: {username}</Text>
        <Text style={detailsText}>Subscription Period: {duration} Days</Text>
        <Text style={detailsText}>Subscription Date: {date}</Text>
      </Section>
      <Text style={paragraph}>
        Keep creating, and we'll take care of the rest!
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

export default NewSubscriber;
