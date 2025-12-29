const bcrypt = require('bcryptjs');
const db = require('../config/database');
require('dotenv').config();

async function createAdmin() {
  try {
    const name = 'Admin User';
    const email = 'admin@beautyparlor.com';
    const password = 'admin123';
    const role = 'admin';

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin already exists
    const [existing] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    // Create admin user
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    console.log('Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Please change the password after first login.');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();

