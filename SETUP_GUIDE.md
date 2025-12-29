# Beauty Parlor Management System - Complete Setup Guide

This guide will help you set up the complete Beauty Parlor Management System from scratch.

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

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

3. **Configure Environment Variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=beauty_parlor
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```
   
   **Important:** Replace `your_mysql_password` with your actual MySQL password.

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

1. **Navigate to Frontend Directory**
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
   
   The frontend will run on `http://localhost:3000`

## Step 4: Initial Data Setup

The database schema already includes sample services. However, you may want to:

1. **Add Availability Slots** (Optional)
   - Use the admin dashboard to set availability for services
   - Or create a script to populate availability for the next 30 days

2. **Create Test Users** (Optional)
   - Use the registration page to create test user accounts
   - Or create users directly in the database

## Step 5: Access the Application

1. **Open Browser**
   - Navigate to `http://localhost:3000`

2. **Login as Admin**
   - Email: `admin@beautyparlor.com`
   - Password: `admin123`

3. **Or Register as User**
   - Click "Register here" on the login page
   - Create a new user account

## Project Structure

```
Beauty_parlor_Frontend/
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
│   │   └── createAdmin.js
│   ├── server.js
│   ├── package.json
│   └── .env
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

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check `.env` file has correct database credentials
- Ensure database `beauty_parlor` exists

### Port Already in Use
- Backend: Change `PORT` in `.env` file
- Frontend: React will prompt to use a different port

### CORS Issues
- Ensure backend is running on port 5000
- Check API URLs in frontend code match backend port

### Authentication Issues
- Verify JWT_SECRET is set in `.env`
- Check token is being sent in Authorization header
- Ensure admin user exists (run createAdmin.js)

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Configure proper CORS origins
4. Use environment variables for all sensitive data

### Frontend
1. Build the app: `npm run build`
2. Serve the `build` folder using a web server (nginx, Apache, etc.)
3. Update API URLs to point to production backend

## Support

For issues or questions, check:
- Backend README: `backend/README.md`
- Frontend README: `beauty-parlor-frontend/README.md`

