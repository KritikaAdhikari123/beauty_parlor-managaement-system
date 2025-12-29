const db = require('../config/database');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Configuration:');
    console.log(`  Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`  Port: ${process.env.DB_PORT || 3306}`);
    console.log(`  User: ${process.env.DB_USER || 'root'}`);
    console.log(`  Database: ${process.env.DB_NAME || 'beauty_parlor'}`);
    console.log(`  Password: ${process.env.DB_PASSWORD ? '***' : '(empty)'}`);
    console.log('');

    // Test connection
    const [rows] = await db.execute('SELECT 1 as test');
    
    if (rows && rows.length > 0) {
      console.log('✅ Database connection successful!');
      
      // Check if database exists
      const [databases] = await db.execute('SHOW DATABASES');
      const dbExists = databases.some(db => db.Database === (process.env.DB_NAME || 'beauty_parlor'));
      
      if (dbExists) {
        console.log(`✅ Database '${process.env.DB_NAME || 'beauty_parlor'}' exists`);
        
        // Check tables
        const [tables] = await db.execute('SHOW TABLES');
        console.log(`✅ Found ${tables.length} table(s):`);
        tables.forEach(table => {
          const tableName = Object.values(table)[0];
          console.log(`   - ${tableName}`);
        });
      } else {
        console.log(`⚠️  Database '${process.env.DB_NAME || 'beauty_parlor'}' does not exist`);
        console.log('   Please create it and import the schema.sql file');
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('');
    console.error('Error details:');
    console.error(`  Code: ${error.code}`);
    console.error(`  Message: ${error.message}`);
    console.error('');
    console.error('Troubleshooting:');
    console.error('  1. Make sure XAMPP MySQL is running');
    console.error('  2. Check your .env file settings');
    console.error('  3. Verify database credentials');
    console.error('  4. Ensure database exists');
    process.exit(1);
  }
}

testConnection();

