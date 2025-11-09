import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

console.log("Testing email configuration...");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "***" + process.env.EMAIL_PASSWORD.slice(-4) : "NOT SET");

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Test email
const testEmail = async () => {
  try {
    console.log("\nSending test email...");
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: "Test Email - OIMWU",
      html: `
        <h1>Test Email</h1>
        <p>If you receive this email, your email configuration is working correctly!</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("\nCheck your inbox:", process.env.EMAIL_USER);
  } catch (error) {
    console.error("❌ Error sending email:");
    console.error(error);
  }
};

testEmail();

