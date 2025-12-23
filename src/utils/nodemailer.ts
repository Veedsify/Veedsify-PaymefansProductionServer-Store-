import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

interface MailConfig {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
}

const createTransporter = (): Transporter => {
  const mailHost = process.env.MAIL_HOST;
  const mailPort = process.env.MAIL_PORT;
  const mailUser = process.env.MAIL_USER;
  const mailPass = process.env.MAIL_PASS;

  if (!mailHost || !mailPort || !mailUser || !mailPass) {
    throw new Error(
      "Missing email configuration. Please set MAIL_HOST, MAIL_PORT, MAIL_USER, and MAIL_PASS environment variables.",
    );
  }

  const config: MailConfig = {
    host: mailHost,
    port: Number(mailPort),
    auth: {
      user: mailUser,
      pass: mailPass,
    },
  };

  const transporter = nodemailer.createTransport(config);

  transporter.on("error", (err: Error) => {
    console.error("Nodemailer error:", err);
  });

  return transporter;
};

const mailer = createTransporter();

export default mailer;
