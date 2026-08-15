const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendVerificationEmail(toEmail, token) {
  const link = `${process.env.CLIENT_URL}/verify/${token}`;
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: toEmail,
      subject: "Verify your Pinboard account",
      html: `<p>Click below to verify your account:</p><a href="${link}">${link}</a>`
    });

    if (error) {
      console.error("EMAIL SEND FAILED:", error.message);
      throw new Error(error.message);
    }

    console.log("Email sent:", data.id);
  } catch (err) {
    console.error("EMAIL SEND FAILED:", err.message);
    throw err;
  }
}

module.exports = sendVerificationEmail;