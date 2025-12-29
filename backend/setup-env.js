const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('✓ .env file already exists');
  process.exit(0);
}

// Create .env from template
const envTemplate = `PORT=5001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=beauty_parlor
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_${Date.now()}
JWT_EXPIRE=7d
NODE_ENV=development
`;

try {
  fs.writeFileSync(envPath, envTemplate);
  console.log('✓ .env file created successfully');
  console.log('⚠️  Please update DB_PASSWORD in backend/.env with your MySQL password');
} catch (error) {
  console.error('✗ Error creating .env file:', error.message);
  process.exit(1);
}

