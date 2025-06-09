import nodemailer from 'nodemailer';
import { getBaseUrl } from '@/lib/utils';

// Configuration
const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME || 'Your Company Name';
const COMPANY_EMAIL = process.env.GMAIL_EMAIL; // Your Gmail address
const EMAIL_PASSWORD = process.env.GMAIL_APP_PASSWORD; // App password from Google Account
const CURRENT_YEAR = new Date().getFullYear();

if (!COMPANY_EMAIL || !EMAIL_PASSWORD) {
  console.error('Missing required email configuration. Please set GMAIL_EMAIL and GMAIL_APP_PASSWORD environment variables.');
}

// Create a transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: COMPANY_EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

/**
 * Sends a password reset email with a verification code
 * @param email - Recipient's email address
 * @param token - 6-digit verification code
 * @param fullName - Recipient's full name (optional)
 */
export async function sendPasswordResetEmail(email: string, token: string, fullName: string = 'User') {
  try {
    const resetLink = `${getBaseUrl()}/reset-password?email=${encodeURIComponent(email)}&token=${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Request</title>
          <style>
              body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  line-height: 1.6;
                  color: #333333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
              }
              .header {
                  text-align: center;
                  padding: 20px 0;
                  border-bottom: 1px solid #eaeaea;
                  margin-bottom: 30px;
              }
              .logo {
                  max-width: 180px;
                  height: auto;
              }
              .content {
                  padding: 0 20px;
              }
              .button {
                  display: inline-block;
                  padding: 12px 30px;
                  background-color: #4F46E5;
                  color: white !important;
                  text-decoration: none;
                  border-radius: 6px;
                  font-weight: 600;
                  margin: 25px 0;
              }
              .footer {
                  margin-top: 40px;
                  padding-top: 20px;
                  border-top: 1px solid #eaeaea;
                  font-size: 12px;
                  color: #666666;
                  text-align: center;
              }
              .code {
                  font-family: monospace;
                  font-size: 24px;
                  letter-spacing: 2px;
                  background-color: #f5f5f5;
                  padding: 10px 20px;
                  border-radius: 4px;
                  margin: 20px 0;
                  display: inline-block;
              }
              .expiry-note {
                  color: #666666;
                  font-size: 14px;
                  font-style: italic;
              }
          </style>
      </head>
      <body>
          <div class="header">
              <img src="${getBaseUrl()}/logo.png" alt="${COMPANY_NAME} Logo" class="logo">
          </div>
          
          <div class="content">
              <h2>Reset Your Password</h2>
              
              <p>Hello <strong>${fullName}</strong>,</p>
              
              <p>We received a request to reset the password for your account. Use the following verification code to proceed:</p>
              
              <div class="code">${token}</div>
              
              <p>Or click the button below to reset your password:</p>
              
              <a href="${resetLink}" class="button">Reset Password</a>
              
              <p class="expiry-note">This link will expire in 15 minutes.</p>
              
              <p>If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
              
              <p>For security reasons, please don't share this code with anyone. Our support team will never ask you for this code.</p>
              
              <p>Need help? Contact our support team at <a href="mailto:${COMPANY_EMAIL}">${COMPANY_EMAIL}</a></p>
              
              <p>Best regards,<br>The ${COMPANY_NAME} Team</p>
          </div>
          
          <div class="footer">
              <p>© ${CURRENT_YEAR} ${COMPANY_NAME}. All rights reserved.</p>
              <p>
                  <a href="${getBaseUrl()}/privacy-policy" style="color: #4F46E5; text-decoration: none;">Privacy Policy</a> | 
                  <a href="${getBaseUrl()}/terms" style="color: #4F46E5; text-decoration: none;">Terms of Service</a>
              </p>
              <p>
                  ${COMPANY_NAME}<br>
                  123 Business Street, City, Country
              </p>
          </div>
      </body>
      </html>
    `;

    // Send email using Nodemailer
    const info = await transporter.sendMail({
      from: `"${COMPANY_NAME}" <${COMPANY_EMAIL}>`,
      to: email,
      subject: 'Reset Your Password',
      html,
    });

    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error in sendPasswordResetEmail:', error);
    throw new Error('Failed to send password reset email');
  }
}
