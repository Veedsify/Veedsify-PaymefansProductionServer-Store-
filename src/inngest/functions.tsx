import { render } from "@react-email/components";
import { inngest } from "./client";
import CommunityWelcomeEmail from "../../emails/WelcomeEmail";
import mailer from "@/utils/nodemailer";

export const sendEmailQueue = inngest.createFunction(
    { id: "send-emails" },
    { event: "emails/store.email" },
    async ({ event, step }) => {
        const storeEmailTemplate = await render(<CommunityWelcomeEmail />);
        const sendEmail = await new Promise((resolve, reject) => {
            mailer.sendMail(
                {
                    to: event.data.email,
                    subject: "Order Confirmed",
                    html: storeEmailTemplate,
                    from: `Paymefans Store<info@paymefans.com>`,
                },
                (err, info) => {
                    if (err) {
                        console.log(err);
                        reject({ message: "Email Failed To Send" });
                    }
                    console.log(info);
                    resolve({ message: "Email Sent Successfully" });
                }
            );
        });

        return sendEmail;
    }
);
