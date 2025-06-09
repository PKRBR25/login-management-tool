require('dotenv').config({ path: '.env.local' });

console.log('Current Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('EMAIL_USERNAME:', process.env.EMAIL_USERNAME ? 'Set' : 'Not set');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'Not set');

if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
  console.error('❌ Error: Required environment variables are not set');
  process.exit(1);
}

console.log('✅ Environment variables loaded successfully');
