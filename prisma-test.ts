const { PrismaClient } = require('@prisma/client');

async function testPrisma() {
  let prisma;
  try {
    prisma = new PrismaClient();
    console.log('Prisma Client created successfully');
    
    // Test connection
    await prisma.$connect();
    console.log('Successfully connected to the database');
    
    // Try a simple query
    const users = await prisma.user.findMany();
    console.log('Users:', users);
    
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

// Run the test
testPrisma()
  .then(success => {
    console.log(success ? 'Test completed successfully' : 'Test failed');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
