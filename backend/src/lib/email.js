import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send OTP email (for registration, login, or password reset)
export const sendOTPEmail = async (email, otp, name, purpose = "verification") => {
  try {
    let subject = "OTP Verification - OIMWU";
    let message = "Please use the following OTP to verify your email:";

    if (purpose === "password-reset") {
      subject = "Password Reset OTP - OIMWU";
      message = "You have requested to reset your password. Please use the following OTP to proceed:";
    } else if (purpose === "registration") {
      subject = "Registration OTP - OIMWU";
      message = "Welcome! Please use the following OTP to complete your registration:";
    } else if (purpose === "login") {
      subject = "Login OTP - OIMWU";
      message = "Please use the following OTP to login to your account:";
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
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
              <h1>ODIA INTERSTATE MIGRANT WORKERS UNION</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>${message}</p>
              <div class="otp-box">${otp}</div>
              <p><strong>This OTP is valid for 10 minutes.</strong></p>
              <p>If you did not request this, please ignore this email.</p>
              <p>Best regards,<br>OIMWU Team</p>
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
export const sendWelcomeEmail = async (email, name, userId, membershipType, membershipExpiry) => {
  try {
    const expiryDate = new Date(membershipExpiry).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Welcome to ODIA INTERSTATE MIGRANT WORKERS UNION",
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
            .info-box { background-color: white; border: 1px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .button { display: inline-block; background-color: #FF6B35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ODIA INTERSTATE MIGRANT WORKERS UNION!</h1>
            </div>
            <div class="content">
              <h2>Dear ${name},</h2>
              <p>Congratulations! Your registration has been successfully completed.</p>
              <p>Your unique User ID is:</p>
              <div class="user-id-box">${userId}</div>
              <div class="info-box">
                <p><strong>Membership Plan:</strong> ${membershipType.charAt(0).toUpperCase() + membershipType.slice(1)}</p>
                <p><strong>Valid Until:</strong> ${expiryDate}</p>
              </div>
              <p>You can download your ID Card and Payment Receipt using the buttons below:</p>
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/download-id-card/${userId}" class="button">Download ID Card</a>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/download-receipt/${userId}" class="button">Download Receipt</a>
              </div>
              <p>You are now a proud member of the ODIA INTERSTATE MIGRANT WORKERS UNION. We are committed to empowering Odia migrant workers.</p>
              <p>Best regards,<br>OIMWU Team</p>
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

// Send plan expiring soon email (7 days before expiry)
export const sendPlanExpiringEmail = async (email, name, userId, membershipType, membershipExpiry) => {
  try {
    const expiryDate = new Date(membershipExpiry).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const daysLeft = Math.ceil((new Date(membershipExpiry) - new Date()) / (1000 * 60 * 60 * 24));

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "⚠️ Your OIMWU Membership is Expiring Soon",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #FF6B35; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; }
            .warning-box { background-color: #fff3cd; border: 2px solid #ffc107; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px; }
            .info-box { background-color: white; border: 1px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .button { display: inline-block; background-color: #FF6B35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 5px; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Membership Expiring Soon</h1>
            </div>
            <div class="content">
              <h2>Dear ${name},</h2>
              <div class="warning-box">
                <h3 style="margin: 0; color: #856404;">Your membership plan is expiring in ${daysLeft} day${daysLeft > 1 ? 's' : ''}!</h3>
              </div>
              <p>This is a friendly reminder that your OIMWU membership will expire soon.</p>
              <div class="info-box">
                <p><strong>User ID:</strong> ${userId}</p>
                <p><strong>Current Plan:</strong> ${membershipType.charAt(0).toUpperCase() + membershipType.slice(1)}</p>
                <p><strong>Expiry Date:</strong> ${expiryDate}</p>
              </div>
              <p>To continue enjoying the benefits of OIMWU membership, please renew your plan before it expires.</p>
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="button">Renew Now</a>
              </div>
              <p>You can also download your current ID Card and Receipt:</p>
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/download-id-card/${userId}" class="button" style="background-color: #6c757d;">Download ID Card</a>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/download-receipt/${userId}" class="button" style="background-color: #6c757d;">Download Receipt</a>
              </div>
              <p>If you have any questions, please contact us.</p>
              <p>Best regards,<br>OIMWU Team</p>
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
    console.log("Plan expiring email sent: " + info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending plan expiring email:", error);
    return { success: false, error: error.message };
  }
};

// Send plan expired email
export const sendPlanExpiredEmail = async (email, name, userId, membershipType, membershipExpiry) => {
  try {
    const expiryDate = new Date(membershipExpiry).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "🔴 Your OIMWU Membership Has Expired - Renew Now",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; }
            .expired-box { background-color: #f8d7da; border: 2px solid #dc3545; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px; }
            .info-box { background-color: white; border: 1px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .button { display: inline-block; background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 5px; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔴 Membership Expired</h1>
            </div>
            <div class="content">
              <h2>Dear ${name},</h2>
              <div class="expired-box">
                <h3 style="margin: 0; color: #721c24;">Your membership plan has expired!</h3>
              </div>
              <p>Your OIMWU membership expired on <strong>${expiryDate}</strong>.</p>
              <div class="info-box">
                <p><strong>User ID:</strong> ${userId}</p>
                <p><strong>Expired Plan:</strong> ${membershipType.charAt(0).toUpperCase() + membershipType.slice(1)}</p>
                <p><strong>Expired On:</strong> ${expiryDate}</p>
              </div>
              <p>To continue accessing OIMWU benefits and services, please renew your membership immediately.</p>
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="button">Renew Membership Now</a>
              </div>
              <p>You can still download your previous ID Card and Receipt:</p>
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/download-id-card/${userId}" class="button" style="background-color: #6c757d;">Download ID Card</a>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/download-receipt/${userId}" class="button" style="background-color: #6c757d;">Download Receipt</a>
              </div>
              <p>We value your membership and look forward to continuing to serve you.</p>
              <p>Best regards,<br>OIMWU Team</p>
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
    console.log("Plan expired email sent: " + info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending plan expired email:", error);
    return { success: false, error: error.message };
  }
};

