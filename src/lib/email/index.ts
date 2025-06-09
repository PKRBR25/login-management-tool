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
  const mailOptions = {
    from: `"Login Management" <${emailUsername}>`,
    to,
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify Your Email Address</h2>
        <p>Hello <strong>${fullName}</strong>,</p>
        <p>Thank you for signing up! Please use the following verification code to complete your registration:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; font-size: 24px; letter-spacing: 2px; text-align: center; margin: 20px 0;">
          ${verificationCode}
        </div>
        <p style="color: #666; font-style: italic;">This code will expire in 15 minutes.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    console.log('Sending verification email to:', to);
    console.log('Using email service:', process.env.EMAIL_USERNAME);
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hello <strong>${fullName}</strong>,</p>
        <p>We received a request to reset your password. Please use the following verification code to proceed:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; font-size: 24px; letter-spacing: 2px; text-align: center; margin: 20px 0;">
          ${resetToken}
        </div>
        <p style="color: #666; font-style: italic;">This code will expire in 15 minutes.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
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
