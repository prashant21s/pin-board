const nodemailer = require("nodemailer");
const { Resend } = require("resend");

async function sendVerificationEmail(toEmail, token) {
  const link = `${process.env.CLIENT_URL}/verify/${token}`;
  try {
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
        to: toEmail,
        subject: "Verify your Pinboard account",
        html: `<p>Click below to verify your account:</p><a href="${link}">${link}</a>`
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log("Email sent:", data.id);
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "Verify your Pinboard account",
      html: `<p>Click below to verify your account:</p><a href="${link}">${link}</a>`
    });

    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("EMAIL SEND FAILED:", err.message);
    throw err;
  }
}

module.exports = sendVerificationEmail;
