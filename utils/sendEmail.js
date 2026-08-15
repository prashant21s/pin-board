const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 10000,   // 10 sec mein fail ho jaye agar connect na ho paye, hang na kare
  greetingTimeout: 10000,
  socketTimeout: 10000
});

async function sendVerificationEmail(toEmail, token) {
  const link = `${process.env.CLIENT_URL}/verify/${token}`;
  try {
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