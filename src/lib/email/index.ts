import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendVerificationEmail(
  to: string,
  verificationCode: number,
  fullName: string = 'User'
) {
  const mailOptions = {
    from: `"Login Management" <${process.env.EMAIL_USERNAME}>`,
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
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: 'Failed to send verification email' };
  }
}
