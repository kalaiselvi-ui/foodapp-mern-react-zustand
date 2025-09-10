import { client, sender } from "./mailtrap";
import {
  generatePasswordResetEmailHtml,
  generateResetSuccessEmailHtml,
  generateWelcomeEmailHtml,
  htmlContent,
} from "./htmlEmail";

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string
) => {
  const recipient = [
    {
      email,
    },
  ];

  const response = await client
    .send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: htmlContent.replace("{verificationToken}", verificationToken),
      category: "Email Verification",
    })
    .then(console.log("Email Verification Failed"), console.error);
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  const recipient = [
    {
      email,
    },
  ];
  const htmlContent = generateWelcomeEmailHtml(name);

  const response = await client
    .send({
      from: sender,
      to: recipient,
      subject: "Welcome to TastySarv",
      html: htmlContent,
      template_variables: {
        company_info_name: "TastySarv",
        name: name,
      },
    })
    .then(console.log("Failed to send welcome email"), console.error);
};

export const sendPasswordResetEmail = async (
  email: string,
  resetURL: string
) => {
  const recipient = [
    {
      email,
    },
  ];
  const htmlContent = generatePasswordResetEmailHtml(resetURL);

  const response = await client
    .send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: htmlContent,
      category: "Reset Password",
    })
    .then(console.log("Failed to reset password"), console.error);
};

export const sendResetSuccessEmail = async (email: string) => {
  const recipient = [
    {
      email,
    },
  ];
  const htmlContent = generateResetSuccessEmailHtml();

  const response = await client
    .send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successfully",
      html: htmlContent,
      category: "Password Reset",
    })
    .then(
      console.log("Failed to send password reset success email"),
      console.error
    );
};
