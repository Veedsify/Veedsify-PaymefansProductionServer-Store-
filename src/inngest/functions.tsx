import { render } from "@react-email/components";
import { inngest } from "./client";
import mailer from "@/utils/nodemailer";
import { Welcome } from "../../emails";
import { OrderConfirmation } from "../../emails";
import { CustomEmail } from "../../emails";

interface OrderConfirmationEvent {
  email: string;
  name: string;
  orderId: string;
  orderDate: string;
  items: Array<{
    product: {
      name: string;
      images?: Array<{ image_url: string }>;
    };
    quantity: number;
    price: number;
    size?: {
      name: string;
    } | null;
  }>;
  totalAmount: number;
  shippingAddress?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    phone?: string;
  };
}

export const sendEmailQueue = inngest.createFunction(
  { id: "send-emails" },
  { event: "emails/store.email" },
  async ({ event, step }) => {
    const storeEmailTemplate = await render(<Welcome />);
    const sendEmail = await new Promise((resolve, reject) => {
      mailer.sendMail(
        {
          to: event.data.email,
          subject: "Order Confirmed",
          html: storeEmailTemplate,
          from: `Paymefans Store<info@paymefans.com>`,
        },
        (err: Error | null, _: any) => {
          if (err) {
            reject({ message: "Email Failed To Send" });
          }
          resolve({ message: "Email Sent Successfully" });
        },
      );
    });

    return sendEmail;
  },
);

export const sendOrderConfirmationEmail = inngest.createFunction(
  { id: "send-order-confirmation-email" },
  { event: "orders/confirmation.send" },
  async ({ event, step }) => {
    const {
      email,
      name,
      orderId,
      orderDate,
      items,
      totalAmount,
      shippingAddress,
    } = event.data as OrderConfirmationEvent;

    // Render the order confirmation email template
    const emailHtml = await step.run("render-email", async () => {
      return await render(
        <OrderConfirmation
          name={name}
          orderId={orderId}
          orderDate={orderDate}
          items={items}
          totalAmount={totalAmount}
          shippingAddress={shippingAddress}
        />,
      );
    });

    // Send the email
    const result = await step.run("send-email", async () => {
      return await new Promise<{ success: boolean; message: string }>(
        (resolve, reject) => {
          mailer.sendMail(
            {
              to: email,
              subject: `Order Confirmed - ${orderId}`,
              html: emailHtml,
              from: `PayMeFans Store <info@paymefans.com>`,
            },
            (err: Error | null, info: any) => {
              if (err) {
                console.error("Order confirmation email send error:", err);
                reject({
                  success: false,
                  message: err.message || "Email Failed To Send",
                });
              } else {
                resolve({
                  success: true,
                  message: "Email Sent Successfully",
                });
              }
            },
          );
        },
      );
    });

    return result;
  },
);

interface ContactEmailEvent {
  email: string;
  name: string;
  subject: string;
  message: string;
}

export const sendContactEmail = inngest.createFunction(
  { id: "send-contact-email" },
  { event: "contact/email.send" },
  async ({ event, step }) => {
    const { email, name, subject, message } = event.data as ContactEmailEvent;

    // Render the contact email template
    const emailHtml = await step.run("render-email", async () => {
      return await render(
        <CustomEmail
          name={name || "there"}
          subject={subject || "Contact Form Submission"}
          message={message || "This is a contact form submission."}
        />,
      );
    });

    // Send the email
    const result = await step.run("send-email", async () => {
      return await new Promise<{ success: boolean; message: string }>(
        (resolve, reject) => {
          mailer.sendMail(
            {
              to: email,
              subject: subject || "Contact Form Submission",
              html: emailHtml,
              from: `PayMeFans Store <info@paymefans.com>`,
            },
            (err: Error | null, info: any) => {
              if (err) {
                console.error("Contact email send error:", err);
                reject({
                  success: false,
                  message: err.message || "Email Failed To Send",
                });
              } else {
                resolve({
                  success: true,
                  message: "Email Sent Successfully",
                });
              }
            },
          );
        },
      );
    });

    return result;
  },
);
