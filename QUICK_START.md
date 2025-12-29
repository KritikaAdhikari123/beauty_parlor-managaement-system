# Quick Start Guide

This guide will help you get the Beauty Parlor Management System up and running quickly.

## Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v5.7 or higher) - [Download](https://dev.mysql.com/downloads/)
- **npm** (comes with Node.js)

## Step 1: Database Setup

1. **Start MySQL Server**
   - Make sure MySQL is running on your system

2. **Create Database and Tables**
   ```bash
   mysql -u root -p < backend/database/schema.sql
   ```
   
   Or manually:
   - Open MySQL Workbench or phpMyAdmin
   - Run the SQL commands from `backend/database/schema.sql`

3. **Verify Database**
   - Database name: `beauty_parlor`
   - Tables created: `users`, `services`, `availability`, `bookings`

## Step 2: Backend Setup

1. **Navigate to Backend Directory**
   ```bash
   cd backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create .env File**
   
   Create a `.env` file in the `backend` directory with the following content:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=beauty_parlor
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```
   
   **Important:** Replace `your_mysql_password_here` with your actual MySQL password.

4. **Create Admin User**
   ```bash
   node scripts/createAdmin.js
   ```
   
   Default admin credentials:
   - Email: `admin@beautyparlor.com`
   - Password: `admin123`
   
   **⚠️ Change the password after first login!**

5. **Populate Availability (Optional but Recommended)**
   ```bash
   node scripts/populateAvailability.js
   ```
   
   This will create availability slots (9 AM - 6 PM) for the next 30 days for all services.

6. **Start Backend Server**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```
   
   The backend will run on `http://localhost:5000`

## Step 3: Frontend Setup

1. **Navigate to Frontend Directory** (in a new terminal)
   ```bash
   cd beauty-parlor-frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Frontend Development Server**
   ```bash
   npm start
   ```
   
   The frontend will run on `http://localhost:3000` and automatically open in your browser.

## Step 4: Access the Application

1. **Open Browser**
   - Navigate to `http://localhost:3000`

2. **Login as Admin**
   - Email: `admin@beautyparlor.com`
   - Password: `admin123`

3. **Or Register as User**
   - Click "Register here" on the login page
   - Create a new user account

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running: `mysql -u root -p`
- Check `.env` file has correct database credentials
- Ensure database `beauty_parlor` exists
- Run: `mysql -u root -p < backend/database/schema.sql`

### Port Already in Use
- Backend: Change `PORT` in `.env` file
- Frontend: React will prompt to use a different port (usually 3001)

### CORS Issues
- Ensure backend is running on port 5000
- Check API URLs in frontend code match backend port

### Authentication Issues
- Verify JWT_SECRET is set in `.env`
- Ensure admin user exists (run `node backend/scripts/createAdmin.js`)
- Clear browser localStorage if having token issues

### Module Not Found Errors
- Run `npm install` in both `backend` and `beauty-parlor-frontend` directories
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

## Project Structure

```
beauty_parlor-managaement-system/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── database/
│   │   └── schema.sql
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── services.js
│   │   ├── availability.js
│   │   ├── bookings.js
│   │   └── admin.js
│   ├── scripts/
│   │   ├── createAdmin.js
│   │   └── populateAvailability.js
│   ├── server.js
│   ├── package.json
│   └── .env (create this file)
│
└── beauty-parlor-frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── services/
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new user

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Availability
- `GET /api/availability/service/:serviceId` - Get availability
- `POST /api/availability` - Set availability (admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/appointments` - All appointments
- `GET /api/admin/booking-history` - Booking history

## Development Tips

- Use `npm run dev` in backend for auto-reload during development
- Frontend automatically reloads on file changes
- Check browser console and terminal for error messages
- Use MySQL Workbench or phpMyAdmin to inspect database

## Next Steps

1. Change admin password after first login
2. Add availability slots for services
3. Create test user accounts
4. Customize services and pricing
5. Set up production environment variables

