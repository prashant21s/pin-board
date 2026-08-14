const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendVerificationEmail(toEmail, token) {
  const link = `${process.env.CLIENT_URL}/verify/${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Verify your Pinboard account",
    html: `<p>Click below to verify your account:</p><a href="${link}">${link}</a>`
  });
}

module.exports = sendVerificationEmail;