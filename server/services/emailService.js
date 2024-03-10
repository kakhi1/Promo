const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your preferred service
  auth: {
    user: process.env.EMAIL_USERNAME, // Email from which you'll send reset password link
    pass: process.env.EMAIL_PASSWORD, // Email password or app password if 2FA is enabled
  },
});

exports.sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `https://promo123.netlify.app/reset-password/${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Password Reset",
    html: `Please click this link to reset your password: <a href="${resetUrl}">${resetUrl}</a>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};
