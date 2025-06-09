require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

console.log('Testing email configuration...');

const emailUsername = process.env.EMAIL_USERNAME;
const emailPassword = process.env.EMAIL_PASSWORD;

console.log('Email username:', emailUsername);
console.log('Email password:', emailPassword ? '***' : 'Not set');

if (!emailUsername || !emailPassword) {
  console.error('❌ Error: Email credentials not found in environment variables');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: emailUsername,
    pass: emailPassword
  },
  tls: {
    // Do not fail on invalid certificates in development
    rejectUnauthorized: false
  },
  debug: true,
  logger: true
});

console.log('\nSending test email...');

transporter.sendMail({
  from: `"Test Sender" <${emailUsername}>`,
  to: 'pedrokusiak@gmail.com',
  subject: 'Test Email',
  text: 'This is a test email',
  html: '<b>This is a test email</b>'
}, (error, info) => {
  if (error) {
    console.error('❌ Error sending email:', error);
  } else {
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
  }
});
