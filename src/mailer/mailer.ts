import nodemailer from "nodemailer";
import { config } from "dotenv";
import RegistrationOTPTemplate from "./user-register";
import BankOTPTemplate from "./bank-register";

config({ path: ".env" });

const mailHost = process.env.EMAIL_HOST as string;
const mailUser = process.env.EMAIL_ID as string;
const mailPass = process.env.EMAIL_APP_KEY as string;

// To be generalized later
const subjects = {
  userRegistration: "Shelf-Savvy Registration OTP",
  bankRegistration: "Shelf-Savvy Bank Registration OTP"
};

const transporter = nodemailer.createTransport({
  service: mailHost,
  secure: true,
  auth: {
    user: mailUser,
    pass: mailPass,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

export type MailArgs = {
  username: string;
  otp: string;
  email: string;
};

export const MailRegistrationOTP = async ({ username, otp, email }: MailArgs): Promise<boolean> => {
  const mailOptions = {
    from: {
      name: "Shelf-Savvy",
      address: mailUser,
    },
    to: email,
    subject: subjects.userRegistration + " - " + Date.now(),
    html: RegistrationOTPTemplate(username, otp),
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log("Error in sending user-registration OTP");
    console.log(error);
    return false;
  }
};

export const MailBankRegistrationOTP = async ({ username, otp, email }: MailArgs): Promise<boolean> => {
  const mailOptions = {
    from: {
      name: "Shelf-Savvy",
      address: mailUser,
    },
    to: email,
    subject: subjects.bankRegistration + " - " + Date.now(),
    html: BankOTPTemplate(username, otp),
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log("Error in sending bank-registration OTP");
    console.log(error);
    return false;
  }
};
