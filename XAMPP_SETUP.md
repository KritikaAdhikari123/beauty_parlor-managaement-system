# XAMPP MySQL Connection Setup Guide

This guide will help you connect your Beauty Parlor Management System to XAMPP's MySQL database.

## Step 1: Start XAMPP Services

1. **Open XAMPP Control Panel**
2. **Start MySQL** - Click the "Start" button next to MySQL
3. **Start Apache** (optional, only if you want to use phpMyAdmin via browser)
   - You can also access phpMyAdmin at: `http://localhost/phpmyadmin`

## Step 2: Create .env File

1. Navigate to the `backend` folder
2. Create a file named `.env` (if it doesn't exist)
3. Copy the following content:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=beauty_parlor
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important Notes:**
- `DB_PASSWORD` is **empty** by default in XAMPP (no password)
- If you set a MySQL password in XAMPP, add it to `DB_PASSWORD`
- `DB_PORT=3306` is the default MySQL port (usually not needed, but included for clarity)

## Step 3: Create Database Using phpMyAdmin

### Option A: Using phpMyAdmin (Recommended)

1. **Open phpMyAdmin**
   - Go to: `http://localhost/phpmyadmin`
   - Or click "Admin" button next to MySQL in XAMPP Control Panel

2. **Create Database**
   - Click "New" in the left sidebar
   - Database name: `beauty_parlor`
   - Collation: `utf8mb4_general_ci` (or leave default)
   - Click "Create"

3. **Import Schema**
   - Select the `beauty_parlor` database from the left sidebar
   - Click on the "Import" tab at the top
   - Click "Choose File" and select: `backend/database/schema.sql`
   - Click "Go" at the bottom
   - Wait for the import to complete

### Option B: Using MySQL Command Line

1. **Open Command Prompt/Terminal**
2. **Navigate to XAMPP MySQL bin folder** (if MySQL is in PATH, skip this)
   ```bash
   cd C:\xampp\mysql\bin
   ```
3. **Login to MySQL**
   ```bash
   mysql -u root
   ```
   (If you have a password: `mysql -u root -p`)
4. **Create and Import Database**
   ```bash
   source C:\Users\ACER\Desktop\Beauty_parlor_Frontend\backend\database\schema.sql
   ```
   Or manually:
   ```sql
   CREATE DATABASE IF NOT EXISTS beauty_parlor;
   USE beauty_parlor;
   ```
   Then copy and paste the contents of `backend/database/schema.sql`

## Step 4: Verify Database Connection

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies** (if not done already)
   ```bash
   npm install
   ```

3. **Test Database Connection** (Recommended first step)
   ```bash
   node scripts/testConnection.js
   ```
   
   This will test your connection and show:
   - Connection status
   - Database existence
   - Tables found
   - Any error messages with troubleshooting tips

4. **Test connection by starting the server**
   ```bash
   npm start
   ```

   You should see:
   ```
   Database connected successfully
   Server running on port 5000
   ```

   If you see an error, check:
   - MySQL is running in XAMPP
   - `.env` file has correct settings
   - Database `beauty_parlor_db` exists

## Step 5: Create Admin User

After the database is set up, create the admin user:

```bash
node scripts/createAdmin.js
```

This will create:
- Email: `admin@beautyparlor.com`
- Password: `admin123`

## Step 6: Populate Availability (Optional)

To add time slots for booking:

```bash
node scripts/populateAvailability.js
```

## Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"

**Solution:** Check your `.env` file:
- If MySQL has no password: `DB_PASSWORD=` (empty)
- If MySQL has a password: `DB_PASSWORD=your_password`

### Error: "Unknown database 'beauty_parlor'"

**Solution:** 
- Make sure you imported the schema.sql file
- Or manually create the database in phpMyAdmin first, then import

### Error: "Can't connect to MySQL server"

**Solution:**
- Check if MySQL is running in XAMPP Control Panel
- Verify the port (default is 3306)
- Check if another MySQL service is running on a different port

### Error: "ER_NOT_SUPPORTED_AUTH_MODE"

**Solution:** If you get authentication errors, you may need to update MySQL user:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
```

## Quick Checklist

- [ ] XAMPP MySQL is running
- [ ] `.env` file created in `backend` folder
- [ ] Database `beauty_parlor` created
- [ ] Schema imported (tables: users, services, availability, bookings)
- [ ] Admin user created
- [ ] Backend server starts without errors

## Testing the Connection

You can test if everything works:

1. Start backend: `npm start`
2. Should see: "Database connected successfully"
3. Try accessing: `http://localhost:5000/api/services`
4. Should return JSON with services (or empty array if no services yet)

## Next Steps

Once the database is connected:
1. Start backend: `cd backend && npm start`
2. Start frontend: `cd beauty-parlor-frontend && npm start`
3. Open browser: `http://localhost:3000`
4. Login with admin credentials

