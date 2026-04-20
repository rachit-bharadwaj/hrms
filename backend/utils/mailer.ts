import nodemailer from "nodemailer";
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } from "../constants/config";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: SMTP_FROM,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};
