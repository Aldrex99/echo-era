import nodemailer from 'nodemailer';
import { AppError } from "./error.util";

export const sendMails = async (receiverEmail: string, object: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: parseInt(process.env.MAILTRAP_PORT as string),
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: receiverEmail,
    subject: object,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new AppError("Une erreur est survenue lors de l'envoi de l'email", 500)
  }
};