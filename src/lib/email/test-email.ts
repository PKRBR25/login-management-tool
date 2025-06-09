console.log('Starting email test...');
console.log('Environment Variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- EMAIL_USERNAME:', process.env.EMAIL_USERNAME ? 'Set' : 'Not set');
console.log('- EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'Not set');

import { sendVerificationEmail } from './index';

async function testEmail() {
  try {
    console.log('\nTesting email configuration...');
    
    // Test with a sample email
    const testEmail = 'pedrokusiak@gmail.com';
    const testCode = Math.floor(100000 + Math.random() * 900000);
    
    console.log(`\nSending test email to: ${testEmail}`);
    console.log(`Verification code: ${testCode}`);
    
    console.log('\nCalling sendVerificationEmail...');
    const result = await sendVerificationEmail(testEmail, testCode, 'Test User');
    
    console.log('\nEmail sending result:', result);
    
    if (result.success) {
      console.log('✅ Test email sent successfully!');
    } else {
      console.error('❌ Failed to send test email:', result.error);
    }
  } catch (error) {
    console.error('❌ Error in test email:', error);
  } finally {
    console.log('\nTest completed.');
    process.exit(0);
  }
}

// Run the test
testEmail().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
