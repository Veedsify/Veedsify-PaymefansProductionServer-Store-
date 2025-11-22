import { Heading, Text, Section, Img, Link } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";

interface CommunityWelcomeProps {
  name?: string;
}

export const CommunityWelcome = ({ name = "there" }: CommunityWelcomeProps) => {
  return (
    <EmailLayout
      preview="Welcome to PayMeFans as a Model/Creator!"
      heroImage="/PayMe Fans/Art 07.png"
      heroText="You're in"
      showButtons
      primaryButtonText="Get Started Now"
      primaryButtonLink="#"
      secondaryButtonText="View Guidelines"
      secondaryButtonLink="#"
    >
      <Heading style={heading}>A Warm Welcome to Model/Creators</Heading>
      <Text style={paragraph}>Dear {name},</Text>
      <Text style={paragraph}>
        We're thrilled to have you on board as a PayMeFans Model. We're beyond
        excited to have you join our community! PayMeFans is a platform designed
        specifically for content creators like you to share your amazing content
        with the world. By joining, you've taken the first step towards
        monetizing your content and connecting with fans who appreciate your
        unique style.
      </Text>
      <Text style={paragraph}>
        <span style={strong}>Here's what you can expect from us:</span>
      </Text>
      <Text style={listItem}>• A platform to share your exclusive content with your fans</Text>
      <Text style={listItem}>• Opportunities to earn money through subscriptions and tips</Text>
      <Text style={listItem}>
        • A community of like-minded creators and fans who support and appreciate your work
      </Text>
      <Text style={listItem}>• Connect with other content creators in our group chat</Text>
      <Text style={listItem}>• Earn 100% of the revenue</Text>
      <Text style={listItem}>
        • A 25% withdrawal fee will be charged as a PayMeFans Creator/Model
      </Text>
      <Text style={listItem}>• You must add a valid payout method to receive payments</Text>
      <Text style={paragraph}>
        <span style={strong}>To get started, simply:</span>
      </Text>
      <Section style={resourcesSection}>
        <Section style={resourceItem}>
          <Img
            src="/PayMe Fans/Art 03.png"
            alt="Step 1"
            width="100"
            height="100"
            style={resourceImage}
          />
          <Text style={resourceTitle}>Step 1</Text>
          <Text style={resourceText}>
            Complete your profile to showcase your brand and style
          </Text>
        </Section>
        <Section style={resourceItem}>
          <Img
            src="/PayMe Fans/Art 04.png"
            alt="Step 2"
            width="100"
            height="100"
            style={resourceImage}
          />
          <Text style={resourceTitle}>Step 2</Text>
          <Text style={resourceText}>
            Upload your exclusive content and set your subscription price
          </Text>
        </Section>
        <Section style={resourceItem}>
          <Img
            src="/PayMe Fans/Art 05.png"
            alt="Step 3"
            width="100"
            height="100"
            style={resourceImage}
          />
          <Text style={resourceTitle}>Step 3</Text>
          <Text style={resourceText}>
            Share your PayMeFans link with your fans and social media networks
          </Text>
        </Section>
      </Section>
      <Text style={paragraph}>
        Our team is always here to support you. If you have any questions or
        need help, just reach out to us at{" "}
        <Link href="mailto:support@paymefans.com" style={linkStyle}>
          support@paymefans.com
        </Link>
        .
      </Text>
      <Text style={paragraph}>
        Thank you for choosing PayMeFans! We're honored to be a part of your
        creative journey.
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

const listItem = {
  fontSize: "16px",
  lineHeight: "1.6",
  marginBottom: "10px",
  color: "#555",
  paddingLeft: "20px",
};

const resourcesSection = {
  marginTop: "30px",
  marginBottom: "20px",
};

const resourceItem = {
  marginBottom: "30px",
  textAlign: "center" as const,
};

const resourceImage = {
  borderRadius: "8px",
  marginBottom: "10px",
  display: "block",
  margin: "0 auto 10px auto",
};

const resourceTitle = {
  fontSize: "20px",
  margin: "0 0 5px 0",
  color: "#333",
  fontWeight: "bold",
};

const resourceText = {
  fontSize: "16px",
  marginTop: "5px",
  color: "#555",
};

const linkStyle = {
  color: "#007bff",
  textDecoration: "underline",
};

const strong = {
  fontWeight: "bold",
};

export default CommunityWelcome;
