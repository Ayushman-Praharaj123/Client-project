import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send OTP email
export const sendOTPEmail = async (email, otp, name) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset OTP - All India Labour Union",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #FF6B35; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; }
            .otp-box { background-color: white; border: 2px solid #FF6B35; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>All India Labour Union</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>You have requested to reset your password. Please use the following OTP to proceed:</p>
              <div class="otp-box">${otp}</div>
              <p><strong>This OTP is valid for 10 minutes.</strong></p>
              <p>If you did not request this password reset, please ignore this email.</p>
              <p>Best regards,<br>All India Labour Union Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

// Send welcome email after registration
export const sendWelcomeEmail = async (email, name, userId) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Welcome to All India Labour Union",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #FF6B35; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; }
            .user-id-box { background-color: white; border: 2px solid #FF6B35; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to All India Labour Union!</h1>
            </div>
            <div class="content">
              <h2>Dear ${name},</h2>
              <p>Congratulations! Your registration has been successfully completed.</p>
              <p>Your unique User ID is:</p>
              <div class="user-id-box">${userId}</div>
              <p>Please keep this User ID safe for future reference.</p>
              <p>You are now a proud member of the All India Labour Union. We are committed to empowering workers all over India.</p>
              <p>Best regards,<br>All India Labour Union Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent: " + info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, error: error.message };
  }
};

