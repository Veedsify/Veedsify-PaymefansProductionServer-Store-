import { Heading, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "./components/EmailLayout";

interface NewMessageProps {
  name?: string;
  link?: string;
}

export const NewMessage = ({ 
  name = "there", 
  link = "https://paymefans.com/messages" 
}: NewMessageProps) => {
  return (
    <EmailLayout
      preview="You've received a new message"
      heroImage="https://ys837zjc1f.ufs.sh/f/yfhOarqJNTGC2Qub9uFdk9hFx1cfK7lmgrp5qybV2T6wZOMP"
      heroText="You've Received a New Message!"
      showButtons
      primaryButtonText="View Message"
      primaryButtonLink={link}
      secondaryButtonText="Contact Support"
      secondaryButtonLink="#"
    >
      <Heading style={heading}>Hi {name},</Heading>
      <Text style={paragraph}>
        You've received a new message on PayMeFans!
      </Text>
      <Text style={paragraph}>
        Please log in to your account to view and reply to your message. Don't
        miss out on the conversation!
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

export default NewMessage;
