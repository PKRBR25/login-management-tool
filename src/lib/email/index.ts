import nodemailer from 'nodemailer';
require('dotenv').config({ path: '.env.local' });

const emailUsername = process.env.GMAIL_EMAIL;
const emailPassword = process.env.GMAIL_APP_PASSWORD;

if (!emailUsername || !emailPassword) {
  console.error('❌ Email configuration error:');
  console.error('- GMAIL_EMAIL:', emailUsername ? 'Set' : 'Not set');
  console.error('- GMAIL_APP_PASSWORD:', emailPassword ? 'Set' : 'Not set');
  throw new Error('Email configuration is missing. Please check your .env.local file');
}

console.log('📧 Email configuration:');
console.log('- Service: Gmail SMTP');
console.log(`- Sender: ${emailUsername}`);
console.log(`- Environment: ${process.env.NODE_ENV || 'development'}`);

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: emailUsername.trim(),
    pass: emailPassword.replace(/["']/g, '').trim(),
  },
  tls: {
    // Disable certificate validation in development
    rejectUnauthorized: false
  },
  debug: true,
  logger: true
});

transporter.verify(function(error, success) {
  if (error) {
    console.error('❌ SMTP Connection Error:', error);
  } else {
    console.log('✅ SMTP Server is ready to take our messages');
  }
});

export async function sendVerificationEmail(
  to: string,
  verificationCode: number,
  fullName: string = 'User'
) {
  // Check if environment variables are set
  console.log('Verification Email - Environment Variables:');
  console.log('- GMAIL_EMAIL:', emailUsername);
  console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
  console.log('Using email for support:', emailUsername);
  const currentYear = new Date().getFullYear();
  const companyName = 'Login Management Tool';
  const isDevelopment = process.env.NODE_ENV === 'development';
  const baseUrl = isDevelopment 
    ? 'http://localhost:3000' 
    : `https://${process.env.NEXT_PUBLIC_APP_DOMAIN || 'yourdomain.com'}`;
  
  const mailOptions = {
    from: `"${companyName}" <${emailUsername}>`,
    to,
    subject: 'Verify Your Email Address',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email Address</title>
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
              <img src="${baseUrl}/logo.png" alt="${companyName}" class="logo">
          </div>
          
          <div class="content">
              <h2>Verify Your Email Address</h2>
              
              <p>Hello <strong>${fullName}</strong>,</p>
              
              <p>Thank you for signing up with ${companyName}! Please use the following verification code to complete your registration:</p>
              
              <div class="code">${verificationCode}</div>
              
              <p>You can click the button below to be redirected to the verification page where you should enter this code:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}/verify-email?email=${encodeURIComponent(to)}&code=${verificationCode}" class="button" style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                  Go to Verification
                </a>
              </div>
              
              <p class="expiry-note">This link and code will expire in 15 minutes.</p>
              
              <p>If you didn't create an account with us, you can safely ignore this email.</p>
              
              <p>For security reasons, please don't share this code with anyone. Our support team will never ask you for this code.</p>
              
              <p>Need help? Contact our support team at <a href="mailto:${emailUsername}">${emailUsername}</a></p>
              
              <p>Welcome aboard!<br>The ${companyName} Team</p>
          </div>
          
          <div class="footer">
              <p> ${currentYear} ${companyName}. All rights reserved.</p>
              <p>
                  <a href="${baseUrl}/privacy-policy" style="color: #4F46E5; text-decoration: none;">Privacy Policy</a> | 
                  <a href="${baseUrl}/terms" style="color: #4F46E5; text-decoration: none;">Terms of Service</a>
              </p>
              <p>
                  ${companyName} Team<br>
                  Support Team
              </p>
              <p>
                  <a href="${baseUrl}/unsubscribe?email=${encodeURIComponent(to)}" style="color: #666666; text-decoration: underline;">Unsubscribe</a> | 
                  <a href="${baseUrl}/preferences" style="color: #666666; text-decoration: underline;">Email Preferences</a>
              </p>
          </div>
      </body>
      </html>
    `,
  };

  try {
    console.log('Sending verification email to:', to);
    console.log('Using email service:', process.env.EMAIL_USERNAME);
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    console.log('Verification code:', verificationCode); // Log the verification code for testing
    
    return { success: true };
  } catch (error: unknown) {
    // Type guard to check if error is an instance of Error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorCode = (error as { code?: string }).code;
    const errorCommand = (error as { command?: string }).command;
    
    console.error('Error sending verification email:');
    console.error('Error code:', errorCode);
    console.error('Error command:', errorCommand);
    console.error('Full error:', error);
    
    // More specific error messages based on common issues
    let userFriendlyMessage = 'Failed to send verification email';
    if (errorCode === 'EAUTH') {
      userFriendlyMessage = 'Authentication failed. Please check your email credentials.';
    } else if (errorCode === 'EENVELOPE') {
      userFriendlyMessage = 'Invalid email address';
    } else if (errorCode === 'ECONNECTION' || errorCode === 'ETIMEDOUT') {
      userFriendlyMessage = 'Could not connect to the email server. Please check your internet connection.';
    } else if (errorMessage.includes('self-signed certificate')) {
      userFriendlyMessage = 'Email server certificate validation failed. This might be due to a network proxy or firewall.';
    }
    
    return { 
      success: false, 
      error: userFriendlyMessage,
      details: errorMessage
    };
  }
}

export async function sendPasswordResetEmail(
  to: string,
  resetToken: string,
  fullName: string = 'User'
) {
  // Check if environment variables are set
  console.log('Password Reset Email - Environment Variables:');
  console.log('- GMAIL_EMAIL:', emailUsername);
  console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
  console.log('Using email for password reset support:', emailUsername);
  const currentYear = new Date().getFullYear();
  const companyName = 'Login Management Tool';
  const isDevelopment = process.env.NODE_ENV === 'development';
  const baseUrl = isDevelopment 
    ? 'http://localhost:3000' 
    : `https://${process.env.NEXT_PUBLIC_APP_DOMAIN || 'yourdomain.com'}`;

  const mailOptions = {
    from: `"${companyName}" <${emailUsername}>`,
    to,
    subject: 'Reset Your Password',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
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
              .footer {
                  margin-top: 40px;
                  padding-top: 20px;
                  border-top: 1px solid #eaeaea;
                  font-size: 12px;
                  color: #666666;
                  text-align: center;
              }
          </style>
      </head>
      <body>
          <div class="header">
              <img src="${baseUrl}/logo.png" alt="${companyName} Logo" class="logo">
          </div>
          
          <div class="content">
              <h2>Reset Your Password</h2>
              
              <p>Hello <strong>${fullName || 'User'}</strong>,</p>
              
              <p>We received a request to reset the password for your account. Please use the following verification code to complete the password reset process:</p>
              
              <div class="code">${resetToken}</div>
              
              <p>You can click the button below to be redirected to the password reset page where you should enter this code:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}/reset-password?email=${encodeURIComponent(to)}&token=${resetToken}" class="button" style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                  Go to Password Reset
                </a>
              </div>
              
              <p class="expiry-note">This link and code will expire in 15 minutes.</p>
              
              <p>If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
              
              <p>For security reasons, please don't share this code with anyone. Our support team will never ask you for this code.</p>
              
              <p>Need help? Contact our support team at <a href="mailto:${emailUsername}" style="color: #4F46E5; text-decoration: none;">${emailUsername}</a></p>
              
              <p>Best regards,<br>The ${companyName} Team</p>
          </div>
          
          <div class="footer">
              <p> ${currentYear} ${companyName}. All rights reserved.</p>
              <p>
                  <a href="${baseUrl}/privacy-policy" style="color: #4F46E5; text-decoration: none;">Privacy Policy</a> | 
                  <a href="${baseUrl}/terms" style="color: #4F46E5; text-decoration: none;">Terms of Service</a>
              </p>
              <p>
                  ${process.env.NEXT_PUBLIC_COMPANY_ADDRESS_LINE1 || '123 Company St'}<br>
                  ${process.env.NEXT_PUBLIC_COMPANY_ADDRESS_LINE2 || 'City, State, ZIP'}
              </p>
              <p>
                  <a href="${baseUrl}/unsubscribe?email=${encodeURIComponent(to)}" style="color: #666666; text-decoration: underline;">Unsubscribe</a> | 
                  <a href="${baseUrl}/preferences" style="color: #666666; text-decoration: underline;">Email Preferences</a>
              </p>
          </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: 'Failed to send password reset email' };
  }
}
