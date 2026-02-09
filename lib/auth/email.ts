/**
 * Email Service using Nodemailer
 *
 * This module provides email sending functionality using Gmail SMTP.
 * Supports both HTML and plain text email formats.
 *
 * FREE TIER: Gmail SMTP (500 emails/day free)
 * Setup:
 * 1. Enable 2FA on your Gmail account
 * 2. Generate App Password at: myaccount.google.com/apppasswords
 * 3. Use App Password in SMTP_PASS (not your regular password)
 *
 * Security:
 * - Uses TLS encryption for all communications
 * - App passwords are more secure than regular passwords
 * - No email credentials stored in code
 */

import nodemailer from "nodemailer";

/**
 * Email configuration loaded from environment variables
 */
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  from: process.env.SMTP_FROM || "noreply@sunya.com.np",
} as const;

/**
 * Email data structure
 */
export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

/**
 * Email sending result
 */
export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Create Nodemailer transporter
 * Reuses the same transporter for connection pooling
 */
function createTransporter() {
  if (!EMAIL_CONFIG.auth.user || !EMAIL_CONFIG.auth.pass) {
    throw new Error(
      "SMTP_USER and SMTP_PASS environment variables must be set",
    );
  }

  return nodemailer.createTransport({
    host: EMAIL_CONFIG.host,
    port: EMAIL_CONFIG.port,
    secure: EMAIL_CONFIG.secure,
    auth: {
      user: EMAIL_CONFIG.auth.user,
      pass: EMAIL_CONFIG.auth.pass,
    },
    tls: {
      rejectUnauthorized: true, // Enforce certificate validation
    },
    // Connection pooling for better performance
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
  });
}

// Singleton transporter instance
let transporter: nodemailer.Transporter | null = null;

/**
 * Get or create email transporter
 * @returns Nodemailer transporter instance
 */
function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
}

/**
 * Send an email
 *
 * @param emailData - Email data (to, subject, html, text)
 * @returns Promise resolving to email result
 *
 * @example
 * const result = await sendEmail({
 *   to: "user@example.com",
 *   subject: "Welcome!",
 *   html: "<h1>Welcome to Sunya!</h1>",
 *   text: "Welcome to Sunya!",
 * });
 */
export async function sendEmail(emailData: EmailData): Promise<EmailResult> {
  try {
    const mailOptions = {
      from: emailData.from || EMAIL_CONFIG.from,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text || stripHtml(emailData.html),
    };

    const info = await getTransporter().sendMail(mailOptions);

    console.log(`Email sent: ${info.messageId}`);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Strip HTML tags to create plain text version
 * @param html - HTML string
 * @returns Plain text string
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&nbsp;/g, " ") // Replace &nbsp; with space
    .replace(/&/g, "&") // Replace & with &
    .replace(/</g, "<") // Replace < with <
    .replace(/>/g, ">") // Replace > with >
    .replace(/"/g, '"') // Replace " with "
    .replace(/&#x27;/g, "'") // Replace &#x27; with '
    .replace(/\s+/g, " ") // Collapse whitespace
    .trim();
}

/**
 * Email template: Verification Email
 * Sent when user registers to verify their email address
 *
 * @param fullName - User's full name
 * @param verificationUrl - URL with verification token
 * @returns Email data ready to send
 */
export function createVerificationEmail(
  fullName: string,
  verificationUrl: string,
): Omit<EmailData, "to"> {
  const subject = "Verify your email - Sunya";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #22c55e, #16a34a); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; padding: 14px 28px; background: #22c55e; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .button:hover { background: #16a34a; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
    .link { color: #22c55e; word-break: break-all; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Sunya!</h1>
    </div>
    <div class="content">
      <h2>Hello ${escapeHtml(fullName)},</h2>
      <p>Thank you for signing up! Please verify your email address to complete your registration and start enjoying our healthy, delicious products.</p>
      
      <div style="text-align: center;">
        <a href="${verificationUrl}" class="button">Verify Email Address</a>
      </div>
      
      <p>Or copy and paste this link into your browser:</p>
      <p class="link">${verificationUrl}</p>
      
      <p><strong>This link expires in 24 hours.</strong></p>
      
      <p>If you didn't create an account with Sunya, you can safely ignore this email.</p>
      
      <div class="footer">
        <p>Sunya - Healthy Habits, Happy Life<br>
        Kathmandu, Nepal</p>
        <p>This is an automated email. Please do not reply to this message.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Welcome to Sunya!

Hello ${fullName},

Thank you for signing up! Please verify your email address to complete your registration.

Click the link below to verify your email:
${verificationUrl}

This link expires in 24 hours.

If you didn't create an account with Sunya, you can safely ignore this email.

---
Sunya - Healthy Habits, Happy Life
Kathmandu, Nepal
  `;

  return { subject, html, text };
}

/**
 * Email template: Password Reset Email
 * Sent when user requests password reset
 *
 * @param fullName - User's full name
 * @param resetUrl - URL with reset token
 * @returns Email data ready to send
 */
export function createPasswordResetEmail(
  fullName: string,
  resetUrl: string,
): Omit<EmailData, "to"> {
  const subject = "Reset your password - Sunya";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; padding: 14px 28px; background: #f59e0b; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .button:hover { background: #d97706; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
    .link { color: #f59e0b; word-break: break-all; }
    .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <h2>Hello ${escapeHtml(fullName)},</h2>
      <p>We received a request to reset your password for your Sunya account.</p>
      
      <div style="text-align: center;">
        <a href="${resetUrl}" class="button">Reset Password</a>
      </div>
      
      <p>Or copy and paste this link into your browser:</p>
      <p class="link">${resetUrl}</p>
      
      <div class="warning">
        <strong>⏰ This link expires in 1 hour.</strong>
      </div>
      
      <p><strong>Didn't request this?</strong> If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
      
      <p>For security reasons, this link can only be used once.</p>
      
      <div class="footer">
        <p>Sunya - Healthy Habits, Happy Life<br>
        Kathmandu, Nepal</p>
        <p>This is an automated email. Please do not reply to this message.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Password Reset Request - Sunya

Hello ${fullName},

We received a request to reset your password for your Sunya account.

Click the link below to reset your password:
${resetUrl}

This link expires in 1 hour.

Didn't request this?
If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

For security reasons, this link can only be used once.

---
Sunya - Healthy Habits, Happy Life
Kathmandu, Nepal
  `;

  return { subject, html, text };
}

/**
 * Email template: Welcome Email (after verification)
 * Sent after user successfully verifies their email
 *
 * @param fullName - User's full name
 * @returns Email data ready to send
 */
export function createWelcomeEmail(fullName: string): Omit<EmailData, "to"> {
  const subject = "Welcome to Sunya! 🌱";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Sunya</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #22c55e, #16a34a); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; padding: 14px 28px; background: #22c55e; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .features { margin: 20px 0; }
    .feature { display: flex; align-items: center; margin: 15px 0; }
    .feature-icon { font-size: 24px; margin-right: 15px; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Sunya! 🌱</h1>
    </div>
    <div class="content">
      <h2>Hello ${escapeHtml(fullName)},</h2>
      <p>Your email has been verified and your account is now active! We're excited to have you join our community of health-conscious individuals.</p>
      
      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/products" class="button">Explore Our Products</a>
      </div>
      
      <div class="features">
        <h3>What you can do now:</h3>
        <div class="feature">
          <span class="feature-icon">🛒</span>
          <span>Browse and purchase our healthy dehydrated fruit products</span>
        </div>
        <div class="feature">
          <span class="feature-icon">📊</span>
          <span>Track your nutrition with Sunya Care</span>
        </div>
        <div class="feature">
          <span class="feature-icon">🎁</span>
          <span>Create custom gift boxes for your loved ones</span>
        </div>
        <div class="feature">
          <span class="feature-icon">🚚</span>
          <span>Subscribe for regular deliveries and save</span>
        </div>
      </div>
      
      <p>Have questions? Reply to this email or contact us at support@sunya.com.np</p>
      
      <div class="footer">
        <p>Sunya - Healthy Habits, Happy Life<br>
        Kathmandu, Nepal</p>
        <p>Follow us on social media for healthy tips and exclusive offers!</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Welcome to Sunya! 🌱

Hello ${fullName},

Your email has been verified and your account is now active! We're excited to have you join our community.

What you can do now:
- Browse and purchase our healthy dehydrated fruit products
- Track your nutrition with Sunya Care
- Create custom gift boxes for your loved ones
- Subscribe for regular deliveries and save

Visit us at: ${process.env.NEXT_PUBLIC_APP_URL}/products

Have questions? Contact us at support@sunya.com.np

---
Sunya - Healthy Habits, Happy Life
Kathmandu, Nepal
  `;

  return { subject, html, text };
}

/**
 * Escape HTML special characters
 * Prevents XSS in email templates
 *
 * @param text - Text to escape
 * @returns Escaped text safe for HTML
 */
function escapeHtml(text: string): string {
  const div =
    typeof document !== "undefined" ? document.createElement("div") : null;
  if (div) {
    div.textContent = text;
    return div.innerHTML;
  }
  // Server-side fallback
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/**
 * Verify email configuration
 * Checks if all required environment variables are set
 * @returns Object with valid flag and missing variables
 */
export function verifyEmailConfig(): {
  valid: boolean;
  missing: string[];
} {
  const missing: string[] = [];

  if (!EMAIL_CONFIG.auth.user) missing.push("SMTP_USER");
  if (!EMAIL_CONFIG.auth.pass) missing.push("SMTP_PASS");
  if (!EMAIL_CONFIG.from) missing.push("SMTP_FROM");

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Test email configuration
 * Sends a test email to verify SMTP settings
 *
 * @param testEmail - Email address to send test to
 * @returns Email result
 */
export async function testEmailConfig(testEmail: string): Promise<EmailResult> {
  const config = verifyEmailConfig();
  if (!config.valid) {
    return {
      success: false,
      error: `Missing configuration: ${config.missing.join(", ")}`,
    };
  }

  return sendEmail({
    to: testEmail,
    subject: "Test Email - Sunya",
    html: "<h1>Test Email</h1><p>If you received this, your email configuration is working!</p>",
    text: "Test Email - If you received this, your email configuration is working!",
  });
}
