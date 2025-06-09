const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function testConnection() {
  console.log('🔍 Testing database connection...');
  let client;
  
  try {
    client = await pool.connect();
    console.log('✅ Successfully connected to the database');
    
    // Test query
    const result = await client.query('SELECT version()');
    console.log('📋 Database version:', result.rows[0].version);
    
    // Check if users table exists
    try {
      const tableCheck = await client.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE  table_schema = 'public'
          AND    table_name   = 'User'
        )`
      );
      
      const tableExists = tableCheck.rows[0].exists;
      console.log('📊 Users table exists:', tableExists);
      
      if (tableExists) {
        const users = await client.query('SELECT id, email, created_at FROM "User" LIMIT 5');
        console.log(`👥 Found ${users.rows.length} users:`);
        console.log(users.rows);
      }
      
    } catch (e) {
      console.error('❌ Error checking users table:', e);
    }
    
  } catch (error) {
    console.error('❌ Database connection error:', error);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

testConnection();
