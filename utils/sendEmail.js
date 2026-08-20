const nodemailer = require("nodemailer");

async function sendVerificationEmail(toEmail, token) {
  const link = `${process.env.CLIENT_URL}/verify/${token}`;
  try {
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
