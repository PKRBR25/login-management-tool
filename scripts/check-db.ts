const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function checkDatabase() {
  try {
    console.log('🔍 Checking database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Successfully connected to the database');
    
    // Check if User table exists and count users
    try {
      const userCount = await prisma.user.count();
      console.log(`📊 Total users in database: ${userCount}`);
      
      if (userCount > 0) {
        const users = await prisma.user.findMany({
          select: { id: true, email: true, created_at: true, is_verified: true },
          take: 5,
          orderBy: { created_at: 'desc' }
        });
        console.log('📋 Latest users:', JSON.stringify(users, null, 2));
      }
    } catch (e) {
      console.error('❌ Error querying users:', e);
    }
    
    // Check database version
    const dbVersion = await prisma.$queryRaw`SELECT version()`;
    console.log('🗄️ Database version:', dbVersion);
    
  } catch (error) {
    console.error('❌ Database connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Check failed:', error);
    process.exit(1);
  });
