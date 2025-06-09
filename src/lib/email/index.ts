import nodemailer from 'nodemailer';
require('dotenv').config({ path: '.env.local' });

const emailUsername = process.env.EMAIL_USERNAME;
const emailPassword = process.env.EMAIL_PASSWORD;

if (!emailUsername || !emailPassword) {
  console.error('❌ Email configuration error:');
  console.error('- EMAIL_USERNAME:', emailUsername ? 'Set' : 'Not set');
  console.error('- EMAIL_PASSWORD:', emailPassword ? 'Set' : 'Not set');
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
  const currentYear = new Date().getFullYear();
  const companyName = 'Login Management Tool';
  
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
              <img src="https://yourdomain.com/logo.png" alt="${companyName}" class="logo">
          </div>
          
          <div class="content">
              <h2>Verify Your Email Address</h2>
              
              <p>Hello <strong>${fullName}</strong>,</p>
              
              <p>Thank you for signing up with ${companyName}! To complete your registration, please verify your email address by entering the following verification code:</p>
              
              <div class="code">${verificationCode}</div>
              
              <p class="expiry-note">This code will expire in 15 minutes.</p>
              
              <p>If you didn't create an account with us, you can safely ignore this email.</p>
              
              <p>For security reasons, please don't share this code with anyone. Our support team will never ask you for this code.</p>
              
              <p>Need help? Contact our support team at <a href="mailto:${emailUsername}">${emailUsername}</a></p>
              
              <p>Welcome aboard!<br>The ${companyName} Team</p>
          </div>
          
          <div class="footer">
              <p>© ${currentYear} ${companyName}. All rights reserved.</p>
              <p>
                  <a href="#" style="color: #4F46E5; text-decoration: none;">Privacy Policy</a> | 
                  <a href="#" style="color: #4F46E5; text-decoration: none;">Terms of Service</a>
              </p>
              <p>
                  ${companyName} Team<br>
                  Support Team
              </p>
              <p>
                  <a href="#" style="color: #666666; text-decoration: underline;">Unsubscribe</a> | 
                  <a href="#" style="color: #666666; text-decoration: underline;">Email Preferences</a>
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
  resetToken: number,
  fullName: string = 'User'
) {
  const mailOptions = {
    from: `"Login Management" <${process.env.EMAIL_USERNAME}>`,
    to,
    subject: 'Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
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
              .reset-code {
                  font-family: monospace;
                  font-size: 28px;
                  letter-spacing: 4px;
                  background-color: #f5f5f5;
                  padding: 15px 25px;
                  border-radius: 6px;
                  margin: 25px 0;
                  display: inline-block;
                  font-weight: bold;
                  color: #4F46E5;
              }
              .footer {
                  margin-top: 40px;
                  padding-top: 20px;
                  border-top: 1px solid #eaeaea;
                  font-size: 12px;
                  color: #666666;
                  text-align: center;
              }
              .expiry-note {
                  color: #666666;
                  font-size: 14px;
                  font-style: italic;
                  margin-top: 10px;
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
          </style>
      </head>
      <body>
          <div class="header">
              <h1>Password Reset</h1>
          </div>
          
          <div class="content">
              <p>Hello <strong>${fullName}</strong>,</p>
              <p>We received a request to reset your password. Please use the following verification code to proceed:</p>
              
              <div class="reset-code">
                  ${resetToken}
              </div>
              
              <p class="expiry-note">This code will expire in 15 minutes.</p>
              
              <p>If you didn't request a password reset, you can safely ignore this email.</p>
              
              <p>Best regards,<br>Login Management Team</p>
          </div>
          
          <div class="footer">
              <p> ${new Date().getFullYear()} Login Management. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
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
