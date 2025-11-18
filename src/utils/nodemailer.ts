import nodemailer from "nodemailer";

const nodeConfig = nodemailer.createTransport({
    host: process.env.MAIL_HOST as string,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const mailer = nodeConfig.on("error", (err) => {
    console.log(err);
});

export default mailer;
